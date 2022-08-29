import React, {useState} from 'react';
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
import {useAddProductCart, useCart, useDeleteProductCart} from '../../query/cart';
import {useAddProductWish, useDeleteProductWish, useWish} from "../../query/whish";

function ProductCard({ id, name, description, price, state, quantity, mark, categories, tags, rating, hasCartGesture = true, hasRateGesture = true, canRedirectToDetails = true }) {

    const navigate = useNavigate();
    const { mutationAddCart, data: addData } = useAddProductCart();
    const { mutationDeleteCartById, data: deleteData } = useDeleteProductCart();
    const { data, refetch } = useCart();
    const [alreadyInCart, setAlreadyInCart] = useState(null);
    const { data: wishData, isLoading, refetch: refetchWish } = useWish();
    const { mutationAddWishById, isLoading: addWishLoading, data: addWishData } = useAddProductWish();
    const { mutationDeleteWishById, isLoading: deleteWishLoading, data: delWishData } = useDeleteProductWish();
    const hasLikes = Boolean(wishData?.data?.wishlist?.products?.find((w) => w?.id === id));

    useEffect(() => {
        if (addWishData?.success || delWishData?.success) {
            refetchWish();
        }
    }, [addWishData, delWishData])

    const onUpdateLike = () => {
        if (!deleteWishLoading && !addWishLoading && !isLoading) {
            const isLike = !Boolean(wishData?.data?.wishlist?.products?.find((w) => w?.id === id));
            const token = localStorage.getItem('token');

            if (isLike) {
                mutationAddWishById(token, {idProduct: id, quantity: 1})
            } else {
                mutationDeleteWishById(token, { idProduct: id });
            }
        }
    }

    useEffect(() => {
        if (deleteData?.success || addData?.success) {
            refetch();
        }
    }, [deleteData, addData])

    useEffect(() => {
        if (data) {
            setAlreadyInCart(data?.products?.find((p) => p?.id === id));
        }
    }, [data]);

    const addCart = () => {
        mutationAddCart(localStorage.getItem('token'), { idProduct: id, quantity: 1 });
    };

    const addQuantity = () => {
        if (alreadyInCart) {
            mutationAddCart(localStorage.getItem('token'), { idProduct: id, quantity: alreadyInCart?.cartQuantity + 1 });
            setAlreadyInCart({ ...alreadyInCart, cartQuantity: alreadyInCart?.cartQuantity + 1});
        }
    }

    const deleteQuantity = async () => {
        if (alreadyInCart) {
            if (alreadyInCart?.cartQuantity - 1 === 0) {
                mutationDeleteCartById(localStorage.getItem('token'), { idProduct: alreadyInCart?.id })
            } else {
                mutationAddCart(localStorage.getItem('token'), { idProduct: id, quantity: alreadyInCart?.cartQuantity - 1 });
                setAlreadyInCart({ ...alreadyInCart, cartQuantity: alreadyInCart?.cartQuantity - 1});
            }
        }
    }

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
            </CardContent>
            <CardActions>
                {
                    hasRateGesture && (
                        <>
                            <IconButton onClick={onUpdateLike} aria-label="add to favorites">
                                <FavoriteIcon stroke={hasLikes ? "red" : "grey"} />
                            </IconButton>
                            <Rating name="half-rating" value={rating} spacing={3} readOnly />
                        </>
                    )
                }
                {
                    Boolean(alreadyInCart) && hasCartGesture && (
                        <React.Fragment>
                        <span>
                            Quantity
                        </span>
                            <button onClick={() => deleteQuantity()}>
                                -
                            </button>
                            <p style={{ marginLeft: 4 }}>{alreadyInCart?.cartQuantity}</p>
                            <button onClick={() => addQuantity()}>
                                +
                            </button>
                        </React.Fragment>
                    )
                }
                {
                    !alreadyInCart && hasCartGesture && (
                        <Button size="small" onClick={addCart}>Ajouter au panier</Button>
                    )
                }
            </CardActions>
        </React.Fragment>
    );

    const redirectToProductDetails = () => {
        if (canRedirectToDetails) {
            navigate(`/products/${id}`);
        }
    }

    return (
        <Box className="card">
            <Card variant="outlined">
                {card}
            </Card>
        </Box>
    )
}
export default ProductCard;
