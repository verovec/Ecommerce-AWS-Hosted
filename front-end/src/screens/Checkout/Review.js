import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useCart } from '../../query/cart';
import { useAddress } from '../../query/address';
import { useEffect } from "react";

export default function Review() {

    const { data: cart } = useCart();
    const { mutationAddress, data: address } = useAddress();

    useEffect(() => {
        mutationAddress(localStorage.getItem('token'), { idAddress: localStorage.getItem('addressId') })
    }, []);

    const addresses = [address?.streetNumber, address?.streetName, address?.postalCode, address?.city, address?.country];

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Récapitulatif de la commande
      </Typography>
            <List disablePadding>
                {cart ?.products ?.map((product) => (
                    <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
                        <ListItemText primary={product.name} secondary={product.description} />
                        <Typography variant="body2">{product.price} €</Typography>
                    </ListItem>
                ))}
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Livraison
          </Typography>
                    <Typography gutterBottom>{addresses.join(', ')}</Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
