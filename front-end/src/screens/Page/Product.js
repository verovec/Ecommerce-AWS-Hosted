import React from 'react';
import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../query/products';
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
import { useRating, useCreateRating } from '../../query/rating';
import { TextField } from '@mui/material';

function Product() {
    const theme = createTheme();
    const { id } = useParams();

    const { mutationProduct, data: product, isLoading } = useProduct();
    const { mutationRating, data: ratings } = useRating();
    const { mutationCreateRating, data, error } = useCreateRating();

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataForm = new FormData(event.currentTarget);
        handleClose();
        mutationCreateRating(localStorage.getItem('token'), { idProduct: id, message: dataForm.get('commentaire'), count: +dataForm.get('half-rating') })
    };

    useEffect(() => {
        mutationProduct({ idProduct: id })
        mutationRating({ idProduct: id });
    }, []);

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
                    <div className="product">
                        <div className="product_info">
                            <p className="product_price">
                                <strong>Name: </strong>
                                <small>{product ?.name}</small>
                            </p>
                            <p className="product_price">
                                <strong>Description: </strong>
                                <small>{product ?.description}</small>
                            </p>
                            <p className="product_price">
                                <strong>Price: </strong>
                                <small>${product ?.price}</small>
                            </p>
                            <p className="product_price">
                                <strong>Type: </strong>
                                <small>{product ?.type}</small>
                            </p>
                            <p className="product_price">
                                <strong>State: </strong>
                                <small>{product ?.state}</small>
                            </p>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {product?.mark}
                            </Typography>
                            {
                                product?.categories && product?.categories.map(ctg => (
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom key={ctg.id}>
                                        {ctg.name}
                                    </Typography>
                                ))
                            }
                            {
                                product?.tags && product?.tags.map(tgs => (
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom key={tgs.id}>
                                        {tgs.name}
                                    </Typography>
                                ))
                            }
                            <Button onClick={handleOpen}>Evaluer le produit</Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description">

                                <Box component="form"
                                    sx={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%)',width: 400,bgcolor:'background.paper',borderRadius:'10px',boxShadow:24,p:4,}}
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                <Typography sx={{ mb: 2 }} id="modal-modal-title" variant="h6" component="h2">
                                        Evaluez le produit
                                    </Typography>
                                    <TextField
                                        margin="normal"
                                        id="commentaire"
                                        label="commentaire"
                                        name="commentaire"
                                    />
                                    <Rating margin="normal"
                                        label="half-rating"
                                        name="half-rating"
                                        id='half-rating'
                                        sx={{ mb: 2 }}
                                        spacing={3} />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                    Envoyer
                                    </Button>
                                </Box>
                            </Modal>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                            <p>Commentaires</p>

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
export default Product;

