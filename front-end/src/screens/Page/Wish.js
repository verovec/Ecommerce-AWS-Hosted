import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CurrencyFormat from 'react-currency-format';
import Header from './Header';
import Footer from './Footer';
import ProductCart from './ProductCard';
import { useCart } from '../../query/cart';
import { useNavigate } from 'react-router-dom';
import {useAddProductWish, useDeleteProductWish, useWish} from "../../query/whish";

function Wish() {

    const { data: wish, refetch } = useWish();
    const theme = createTheme();
    const navigate = useNavigate();
    const { mutationAddWishById, data: addWishData } = useAddProductWish();
    const { mutationDeleteWishById, data: deleteWishData } = useDeleteProductWish();

    useEffect(() => {
        if (addWishData?.success || deleteWishData?.success) {
            refetch();
        }
    }, [addWishData, deleteWishData])

    const addQuantity = (productId) => {
        const item = wish?.data?.wishlist?.products?.find((w) => w?.id === productId);

        if (item) {
            mutationAddWishById(localStorage.getItem('token'), { idProduct: productId, quantity: item?.wishlistQuantity + 1 });
        }
    }

    const deleteQuantity = async (productId) => {
        const item = wish?.data?.wishlist?.products?.find((w) => w?.id === productId);

        if (item) {
            if (item?.wishlistQuantity - 1 === 0) {
                mutationDeleteWishById(localStorage.getItem('token'), {idProduct: productId})
            } else {
                mutationAddWishById(localStorage.getItem('token'), {idProduct: productId, quantity: item?.wishlistQuantity - 1});
            }
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" >
                <Header title="My Little Shopping" />

                <main>
                    <div className="basket">
                        <div className="basket_left">
                            {
                                wish?.data?.wishlist?.products?.length === 0 ? (
                                    <div>
                                        <h2 className="basket_title">Your wishlist is empty.</h2>
                                        <p>You have no items in your wishlist.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="basket_shoppingTitle">Items in the Wish List</h2>
                                        {
                                            wish?.data?.wishlist?.products?.map(item => (
                                                <div key={item.id}>
                                                    <ProductCart
                                                        hasCartGesture={false}
                                                        id={item.id}
                                                        name={item.name}
                                                        description={item.description}
                                                        price={item.price}
                                                        state={item.state}
                                                        quantity={item.quantity}
                                                        mark={item.mark}
                                                        categories={item.categories}
                                                        tags={item.tags}
                                                        rating={item.ratingAverage}
                                                    />
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <span style={{ marginRight: 16  }}>
                                                            Quantity
                                                        </span>
                                                        <button onClick={() => deleteQuantity(item.id)}>
                                                            -
                                                        </button>
                                                        <p style={{ marginLeft: 4, marginRight: 4 }}>{item?.wishlistQuantity || 0}</p>
                                                        <button onClick={() => addQuantity(item.id)}>
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </main>
            </Container>
            <Footer
                title="Footer"
                description=""
            />
        </ThemeProvider>
    )
}
export default Wish;
