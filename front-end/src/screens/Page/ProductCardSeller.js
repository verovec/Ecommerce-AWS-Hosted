import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import { useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAddProductCart, useCart } from '../../query/cart';
import DeleteIcon from "@mui/icons-material/Delete";
import {styled} from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import {useDeleteProduct} from "../../query/products";

function ProductCardSeller({ id, name, description, price, state, quantity, mark, categories, tags, rating, onRefresh = () => {} }) {

    const navigate = useNavigate();
    const { mutationAddCart } = useAddProductCart();
    const { mutationDeleteProduct, data: deletedData } = useDeleteProduct();
    const { data } = useCart();
    const [bool, setBool] = React.useState(false);

    useEffect(() => {
        if (deletedData?.success) {
            onRefresh?.();
        }
    }, [deletedData])

    const update = () => {
        mutationAddCart(localStorage.getItem('token'), { idProduct: id, quantity: 1 });
        window.location.reload();
    };

    const deleteById = () => {
        mutationDeleteProduct({ idProduct: id })
    }

    const addQuantity = () => {

    }

    const deleteQuantity = () => {


    }

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }));

    const card = (
        <React.Fragment>
            <CardContent onClick={() => {
                redirectToProductDetails()
            }}>
                <Typography sx={{ fontSize: 25 }}>
                    {name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {description}
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant="body2">
                    {price} €
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Quantité : {quantity}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {state}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {mark}
                </Typography>
                {
                    categories && categories.map(ctg => (
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom key={ctg.id}>
                            {ctg.name}
                        </Typography>
                    ))
                }
                 {
                    tags && tags.map(tgs => (
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom key={tgs.id}>
                            {tgs.name}
                        </Typography>
                    ))
                }
                <Rating name="half-rating" value={rating} spacing={3} readOnly />
            </CardContent>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <IconButton aria-label="cart" style={{ marginRight: 8 }}>
                    <StyledBadge color="secondary">
                        <DeleteIcon onClick={deleteById} />
                    </StyledBadge>
                </IconButton>
            </div>
        </React.Fragment>
    );

    const redirectToProductDetails = () => {
        navigate(`/products/seller/${id}`);
    }

    return (
        <Box className="card">
            <Card variant="outlined">
                {card}
            </Card>
        </Box>
    )
}
export default ProductCardSeller;
