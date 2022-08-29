import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CurrencyFormat from 'react-currency-format';
import Header from './Header';
import Footer from './Footer';
import ProductCart from './ProductCard';
import { useCart } from '../../query/cart';
import { useNavigate } from 'react-router-dom';

function Cart() {

    const { data: cart } = useCart();
    const theme = createTheme();
    const navigate = useNavigate();

    const redirectToDelivery = () => {
        navigate(`/checkout`);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" >
                <Header title="My Little Shopping" />

                <main>
                    <div className="basket">
                        <div className="basket_left">
                            {
                                cart ?.products ?.length === 0 ? (
                                    <div>
                                        <h2 className="basket_title">Your cart is empty.</h2>
                                        <p>You have no items in your basket. Buy one.</p>
                                    </div>
                                ) : (
                                        <div>
                                            <h2 className="basket_shoppingTitle">Items in the Shopping Cart</h2>
                                            {
                                                cart ?.products ?.map(item => (
                                                    <div key={item.id}>
                                                        <ProductCart
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
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                            }

                        </div>
                        {
                            cart ?.products ?.length > 0 && (
                                <div className="basket_right">
                                    <div className="subtotal">
                                        <button className="subtotal_button" onClick={redirectToDelivery}>Passer la commande</button>
                                    </div>
                                </div>
                            )
                        }
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
export default Cart;
