import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../query/cart';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListIcon from "@mui/icons-material/List";
import {useWish} from "../../query/whish";
import Avatar from "@mui/material/Avatar";

function HeaderAdmin(props) {
    const navigate = useNavigate();
    const { title } = props;

    const redirectToHome = () => {
        navigate(`/home/admin`);
    };

    const logout = () => {
        localStorage.setItem('token', null);
    };

    return (
        <React.Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
                {
                    localStorage.getItem('token') ? (
                        <Button href="/" onClick={logout} variant="outlined" size="small" >
                            Se déconnecter
                        </Button>
                    ) : (
                        <Button href="/" variant="outlined" size="small">
                            S'identifier
                        </Button>
                    )
                }

                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{ flex: 1 }}
                    onClick={redirectToHome}
                >
                    {title}
                </Typography>
            </Toolbar>
            <Toolbar
                component="nav"
                variant="dense"
                sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
            >
            </Toolbar>
        </React.Fragment>
    );
}

HeaderAdmin.propTypes = {
    title: PropTypes.string.isRequired
};

export default HeaderAdmin;
