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
import Avatar from "@mui/material/Avatar";

function HeaderSeller(props) {
    const navigate = useNavigate();
    const { title } = props;

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }));

    const redirectToHome = () => {
        navigate(`/home/seller`);
    };

    const logout = () => {
        localStorage.setItem('token', null);
    };

    const redirectToProfil = () => {
        navigate(`/profil`);
    };

    return (
        <React.Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#949494' }}>
                {
                    localStorage.getItem('token') ? (
                        <Button href="/" variant="outlined" size="small" >
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
                <Typography
                    color="inherit"
                    align="right"
                    noWrap
                    onClick={redirectToHome}>
                    Vendeur
                </Typography>
                <IconButton aria-label="cart">
                    <StyledBadge color="secondary">
                        <Avatar style={{ height: 32, width: 32, borderRadius: 16 }} onClick={redirectToProfil} />
                    </StyledBadge>
                </IconButton>
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

HeaderSeller.propTypes = {
    title: PropTypes.string.isRequired
};

export default HeaderSeller;
