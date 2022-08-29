import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {QueryClient, QueryClientProvider} from "react-query";
import './App.css';

import Login from './screens/Authentification/Login';
import Register from './screens/Authentification/Register';
import Checkout from './screens/Checkout/Checkout';
import Home from './screens/Page/Home';
import './App.css';
import {Profil} from "./screens/Page/Profil";
import Product from './screens/Page/Product';
import Cart from './screens/Page/Cart';
import ProductsSeller from './screens/Page/ProductsSeller';
import UpdateProduct from './screens/Page/UpdateProduct';
import Wish from "./screens/Page/Wish";
import Orders from "./screens/Page/Orders";
import Admin from "./screens/Page/Admin";
import AdminUser from "./screens/Page/AdminUser";

export default function App() {

  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <div className="App">
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/home/buyer" element={<Home />} />
            <Route path="/home/admin" element={<Admin />} />
            <Route path="/home/admin/:userId" element={<AdminUser />} />
            <Route path="/products/:id" element={<Product />} />
            <Route path="/products/seller/:id" element={<UpdateProduct/>} />
            <Route path="/home/seller" element={<ProductsSeller />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/wish" element={<Wish />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </QueryClientProvider>
      </div>
    </BrowserRouter>
  );
}



