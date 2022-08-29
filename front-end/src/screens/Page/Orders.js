import * as React from 'react';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Header from './Header';
import Footer from './Footer';
import Grid from '@mui/material/Grid';
import './Home.css';
import ProductCard from './ProductCard';
import { useEffect } from "react";
import { useProducts } from '../../query/products';
import { useCategories } from '../../query/filter';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {useUser} from "../../query";
import {useGetOrders} from "../../query/order";
import {Card, CardContent} from "@mui/material";

const Orders = () => {
    const theme = createTheme();
    const { user } = useUser();
    const { mutationGetOrders, data, isLoading } = useGetOrders();

    useEffect(() => {
        if (user) {
            mutationGetOrders({ userId: user.id })
        }
    }, [user, mutationGetOrders])

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" >
                <Header title="My Little Shopping" />
                <main>
                    <div>
                        {
                            data?.data?.orders?.map((order) => (
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
                    </div>
                </main>
            </Container>
            <Footer
                title="Footer"
                description=""
            />
        </ThemeProvider>
    );
}
export default Orders;
