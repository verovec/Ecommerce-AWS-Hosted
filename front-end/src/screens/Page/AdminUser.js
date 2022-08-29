import React, {useEffect} from 'react';
import HeaderAdmin from "./HeaderAdmin";
import Typography from "@mui/material/Typography";
import {Box, Card, CardContent, CircularProgress, List} from "@mui/material";
import {useDisableAccountById, useEnableAccountById, useUser, useUserById, useUsers} from "../../query";
import {useParams} from "react-router-dom";
import {getRole} from "./Admin";
import {useAddressesById} from "../../query/address";
import AddressFormAdmin from "../Checkout/AddressFormAdmin";
import {useGetOrders, useGetSellerOrders} from "../../query/order";
import ProductCard from "./ProductCard";
import {useProducts} from "../../query/products";
import Grid from "@mui/material/Grid";
import {ActionButton} from "../../Utils/ActionButton";

const AdminUser = () => {
    const { userId } = useParams();
    const { user, isLoading, refetch } = useUserById(userId);
    const { data: address, isLoading: isLoadingAddresses } = useAddressesById(userId);
    const { mutationGetOrders, data: dataOrders, isLoading: isLoadingOrders } = useGetOrders();
    const { mutationGetSellerOrders, data: dataSellerOrders, isLoading: isLoadingSellerOrders } = useGetSellerOrders();
    const { mutationAllProducts, data: products, isLoading: isLoadingProducts } = useProducts();
    const { mutationEnableAccount, isLoading: isLoadingEnable, data: dataEnable } = useEnableAccountById();
    const { mutationDisableAccount, isLoading: isLoadingDisable, data: dataDisable } = useDisableAccountById();

    useEffect(() => {
        if (dataEnable?.success || dataDisable?.success) {
            refetch();
        }
    }, [dataEnable, dataDisable])

    useEffect(() => {
        if (userId) {
            mutationGetOrders({ userId })
        }
    }, [userId])

    useEffect(() => {
        if (user && user?.roles?.isSeller) {
            mutationAllProducts({ params: '&userIds=' + userId })
            mutationGetSellerOrders({ userId })
        }
    }, [user]);

    if (isLoading) {
        return (
            <CircularProgress />
        )
    }

    if (!user) {
        return (
            <div>
                Oops. L'utilisateur n'a pas été trouvé !
            </div>
        )
    }

    const onEnableAccount = () => {
        mutationEnableAccount(userId);
    }

    const onDisableAccount = () => {
        mutationDisableAccount(userId);
    }

    return (
        <div>
            <HeaderAdmin title="Panel Admin" />
            <Box className="card">
                <Card variant="outlined">
                    <div style={{ width: 300, height: 56, margin: 16, display: 'flex' }}>
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center', fontWeight: 'bold' }}>
                            Nom
                        </div>
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            {user?.name}
                        </div>
                    </div>
                    <div style={{ width: 300, height: 56, margin: 16, display: 'flex' }}>
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center', fontWeight: 'bold' }}>
                            Email
                        </div>
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            {user?.email}
                        </div>
                    </div>
                    <div style={{ width: 300, height: 56, margin: 16, display: 'flex' }}>
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center', fontWeight: 'bold' }}>
                            Role
                        </div>
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            {getRole(user?.roles)}
                        </div>
                    </div>
                </Card>
            </Box>
            {
                user?.roles?.isBuyer && (
                    <>
                        {
                            isLoadingAddresses && (
                                <CircularProgress />
                            )
                        }
                        {
                            !isLoadingAddresses && address && (
                                <AddressFormAdmin hasTitle={true} addresses={address} />
                            )
                        }
                        <Typography sx={{ fontSize: 25 }}>
                            Commandes
                        </Typography>
                        {
                            isLoadingOrders && (
                                <CircularProgress />
                            )
                        }
                        {
                            !isLoadingOrders && dataOrders && dataOrders?.data?.orders?.map((order) => (
                                <Box className="card">
                                    <Card variant="outlined">
                                        <div style={{ width: 248, padding: 16 }}>
                                            <div style={{ fontWeight: 'bold' }}>
                                                Informations :
                                            </div>
                                            <p>
                                                Status : {order.status}
                                            </p>
                                            <p>
                                                Ville : {order.address.city}
                                            </p>
                                            <p>
                                                Addresse : {order.address.streetName}
                                            </p>
                                            <p>
                                                Code postal : {order.address.postalCode}
                                            </p>
                                            <p>
                                                Numéro : {order.address.streetNumber}
                                            </p>
                                            <p>
                                                Fait le : {order.address.createdAt}
                                            </p>
                                            <div style={{ marginTop: 16, fontWeight: 'bold' }}>
                                                Produits :
                                            </div>
                                            <div>
                                                {
                                                    order?.products?.map((prd) => (
                                                        <div key={prd.id}>
                                                            <ProductCard
                                                                canRedirectToDetails={false}
                                                                hasCartGesture={false}
                                                                hasRateGesture={false}
                                                                id={prd.id}
                                                                name={prd.name}
                                                                description={prd.description}
                                                                price={prd.price}
                                                                state={prd.state}
                                                                quantity={prd.orderQuantity}
                                                                mark={prd.mark}
                                                                categories={prd.categories}
                                                                tags={prd.tags}
                                                                rating={prd.ratingAverage}
                                                            />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </Card>
                                </Box>
                            ))
                        }
                    </>
                )
            }
            {
                user?.roles?.isSeller && (
                    <>
                        <Typography sx={{ fontSize: 25 }}>
                            Produits
                        </Typography>
                        {
                            isLoadingProducts && (
                                <CircularProgress/>
                            )
                        }
                        {
                            !isLoadingProducts && products && (
                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    {
                                        products?.map(prd => (
                                            <div key={prd.id}>
                                                <ProductCard
                                                    canRedirectToDetails={false}
                                                    hasRateGesture={false}
                                                    hasCartGesture={false}
                                                    id={prd.id}
                                                    name={prd.name}
                                                    description={prd.description}
                                                    price={prd.price}
                                                    state={prd.state}
                                                    quantity={prd.quantity}
                                                    mark={prd.mark}
                                                    categories={prd.categories}
                                                    tags={prd.tags}
                                                    rating={prd.ratingAverage}
                                                />
                                            </div>
                                        ))
                                    }
                                </Grid>
                            )
                        }
                        <Typography sx={{ fontSize: 25 }}>
                            Commandes
                        </Typography>
                        {
                            isLoadingSellerOrders && (
                                <CircularProgress/>
                            )
                        }
                        {
                            !isLoadingSellerOrders && dataSellerOrders && (
                                <div>
                                    {dataSellerOrders?.data?.orders?.map((order) => (
                                        <Box className="card">
                                            <Card variant="outlined">
                                                <div style={{ width: 248, padding: 16 }}>
                                                    <div style={{ fontWeight: 'bold' }}>
                                                        Informations :
                                                    </div>
                                                    <p>
                                                        Status : {order.status}
                                                    </p>
                                                    <p>
                                                        Ville : {order.address?.city}
                                                    </p>
                                                    <p>
                                                        Addresse : {order.address?.streetName}
                                                    </p>
                                                    <p>
                                                        Code postal : {order.address?.postalCode}
                                                    </p>
                                                    <p>
                                                        Numéro : {order.address?.streetNumber}
                                                    </p>
                                                    <p>
                                                        Fait le : {order.address?.createdAt}
                                                    </p>
                                                    <div style={{ marginTop: 16, fontWeight: 'bold' }}>
                                                        Produits :
                                                    </div>
                                                    <div>
                                                        {
                                                            order?.products?.map((prd) => (
                                                                <div key={prd.id}>
                                                                    <ProductCard
                                                                        canRedirectToDetails={false}
                                                                        hasCartGesture={false}
                                                                        hasRateGesture={false}
                                                                        id={prd.id}
                                                                        name={prd.name}
                                                                        description={prd.description}
                                                                        price={prd.price}
                                                                        state={prd.state}
                                                                        quantity={prd.orderQuantity}
                                                                        mark={prd.mark}
                                                                        categories={prd.categories}
                                                                        tags={prd.tags}
                                                                        rating={prd.ratingAverage}
                                                                    />
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </Card>
                                        </Box>
                                    ))}
                                </div>
                            )
                        }
                    </>
                )
            }
            <div style={{ marginBottom: 56, display: 'flex', justifyContent: 'center'  }}>
                {
                    user && user?.enabled && (
                        <ActionButton onPress={onDisableAccount} color="red" title="Désactiver le compte" />
                    )
                }
                {
                    user && !user?.enabled && (
                        <ActionButton onPress={onEnableAccount} color="blue" title="Activer le compte" />
                    )
                }
            </div>
        </div>
    )
}

export default AdminUser;
