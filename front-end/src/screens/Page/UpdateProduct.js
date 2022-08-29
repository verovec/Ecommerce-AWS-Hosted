import React, {useState} from 'react';
import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';
import {
    useCreateProduct,
    useDispatchProduct,
    useProduct,
    useProductOrders,
    useUpdateProduct
} from '../../query/products';
import { useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Header from './Header';
import Button from '@mui/material/Button';
import Footer from './Footer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Modal from '@mui/material/Modal';
import { useRating } from '../../query/rating';
import {Card, TextField} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CustomizedHook from '../../Utils/CustomizedHook';
import { useCategories } from '../../query/filter';
import HeaderSeller from "./HeaderSeller";

function UpdateProduct() {
    const theme = createTheme();
    const { id } = useParams();

    const { mutationProduct, data: product, isLoading } = useProduct();
    const { mutationRating, data: ratings, fullData } = useRating();
    const { mutationUpdateProduct, data: updateData } = useUpdateProduct();
    const { mutationDispatchProduct, data: dispatchedData, isLoading: isLoadingDispatch } = useDispatchProduct();
    const { data } = useCategories();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { data: orders, refetch: refetchOrders, isLoading: isLoadingOrders } = useProductOrders(id);

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (dispatchedData?.success) {
            refetchOrders();
        }
    }, [dispatchedData])

    useEffect(() => {
        if (updateData?.success) {
            mutationProduct({ idProduct: id });
        }
    }, [updateData])

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataForm = new FormData(event.currentTarget);
        handleClose();
        const dFtags = dataForm.get('tags');
        const tags = dFtags?.split(',')?.map((t) => {
            return {
                name: t
            }
        });

        const params = {
            idProduct: id,
            price: dataForm.get('price'),
            name: dataForm.get('name'),
            categories: selectedCategories || [],
            tags,
            quantity: dataForm.get('quantity'),
            description: dataForm.get('description'),
            state: dataForm.get('state')
        };

        mutationUpdateProduct(localStorage.getItem('token'), { ...params })
    };

    const [states, setStates] = React.useState('');

    const handleChange = (event) => {
        setStates(event.target.value);
      };

    useEffect(() => {
        mutationProduct({ idProduct: id })
        mutationRating({ idProduct: id });
    }, []);

    const onSellerSendProduct = (orderId) => {
        mutationDispatchProduct({ idProduct: id, idOrder: orderId })
    }

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
                <HeaderSeller title="My Little Shopping" />

                <main>
                    <div className="product">
                        <div className="product_info">
                            <p className="product_name">
                                <strong>Name: </strong>
                                <small>{product ?.name}</small>
                            </p>
                            <p className="product_description">
                                <strong>Description: </strong>
                                <small>{product ?.description}</small>
                            </p>
                            <p className="product_price">
                                <strong>Price: </strong>
                                <small>${product ?.price}</small>
                            </p>
                            <p className="product_categories">
                                <strong>Catégories: </strong>
                                <small>
                                {
                                    product ?.categories && product ?.categories.map(ctg => (
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom key={ctg.id}>
                                            {ctg.name}
                                        </Typography>
                                    ))
                                }
                                </small>
                            </p>
                            <p className="product_tags">
                                <strong>Tags: </strong>
                                <small>
                                    {
                                        product ?.tags && product ?.tags.map(tgs => (
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom key={tgs.id}>
                                                {tgs.name}
                                            </Typography>
                                        ))
                                    }
                                </small>
                            </p>
                            <p className="product_state">
                                <strong>Etat: </strong>
                                <small>{product ?.state}</small>
                            </p>
                            <p className="product_quantity">
                                <strong>Quantité: </strong>
                                <small>{product ?.quantity}</small>
                            </p>
                            <Button onClick={handleOpen}>Modifier le produit</Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description">

                                <Box component="form"
                                    sx={{ minWidth: 150, position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%)',bgcolor:'background.paper',borderRadius:'10px',boxShadow:24,p:9,}}
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                    <Typography sx={{ mb: 2 }} id="modal-modal-title" variant="h6" component="h2">
                                            Modification
                                    </Typography>
                                    <TextField
                                        margin="normal"
                                        id="name"
                                        label="Nom"
                                        name="name"
                                        defaultValue={product ?.name}
                                    />
                                    <TextField
                                        margin="normal"
                                        id="description"
                                        label="Description"
                                        name="description"
                                        defaultValue={product ?.description}
                                    />
                                    <TextField
                                        margin="normal"
                                        id="price"
                                        label="Prix"
                                        name="price"
                                        type="number"
                                        defaultValue={product ?.price}
                                        min="1"
                                    />
                                    <TextField
                                        margin="normal"
                                        id="quantity"
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        defaultValue={product ?.quantity}
                                        min="1"
                                    />
                                    <TextField
                                        margin="normal"
                                        id="tags"
                                        label="Tags"
                                        name="tags"
                                        defaultValue={product ?.tags.map(tgs => tgs.name)}
                                    />
                                    <CustomizedHook onChangeValue={setSelectedCategories} obj={data} defaultsValues={product?.categories} id="categories" name="categories" />
                                    <Select
                                        labelId="selectState"
                                        id="state"
                                        name="state"
                                        defaultValue={product?.state}
                                        label="Etat"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'NEW'}>NOUVEAU</MenuItem>
                                        <MenuItem value={'OCCASION'}>OCCASION</MenuItem>
                                        <MenuItem value={'RECONDITIONED'}>RECONDITIONNE</MenuItem>
                                    </Select>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 20, mb: 2 }}
                                    >
                                    Modifier
                                    </Button>
                                </Box>
                            </Modal>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                                {
                                    ratings && ratings?.length > 0 && (
                                        <p>Commentaires</p>
                                    )
                                }
                            {
                            ratings && ratings.map(rating => (
                                <React.Fragment key={rating.id}>
                                    <ListItem alignItems="flex-start" >
                                        <ListItemAvatar>
                                            <Avatar />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Rating name="half-rating" value={rating.count} spacing={3} readOnly />
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary">
                                                        {rating.user.name} -
                                                    </Typography>
                                                    - {rating.message}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))
                        }
                            </List>
                            <div>
                                {
                                    orders && orders?.length > 0 && (
                                        <p>Commandes</p>
                                    )
                                }
                                {
                                    isLoadingOrders && (
                                        <CircularProgress />
                                    )
                                }
                                {
                                    orders?.map((order) => (
                                        <Box className="card">
                                            <Card variant="outlined" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                                {
                                                    order.status === "PENDING" && (
                                                        <div>
                                                            {
                                                                isLoadingDispatch && (
                                                                    <CircularProgress />
                                                                )
                                                            }
                                                            {
                                                                !isLoadingDispatch && (
                                                                    <Button style={{ marginTop: 16 }} onClick={() => onSellerSendProduct(order.id)} variant="outlined" size="small" >
                                                                        Commande envoyé
                                                                    </Button>
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </Card>
                                        </Box>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </Container>
            <Footer
                title=""
                description=""
            />
        </ThemeProvider>
    )
}
export default UpdateProduct;

