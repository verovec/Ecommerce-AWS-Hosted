import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {useAddAddress, useAddresses, useRemoveAddress} from '../../query/address';
import {useEffect, useState} from "react";
import {Box, CircularProgress} from "@mui/material";
import Button from "@mui/material/Button";

export default function AddressFormAdmin({ addresses, hasTitle = true, hasAddressCheckbox = true, onPressAddButton, canAdd = false }) {
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    return (
        <React.Fragment>
            {
                hasTitle && (
                    <Typography sx={{ fontSize: 25 }}>
                        Addresses
                    </Typography>
                )
            }
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {addresses && addresses.map((value) => {
                            return (
                                <ListItem key={value.id} disablePadding>
                                    <ListItemButton
                                        selected={selectedIndex === value.id}
                                    >
                                        <ListItemText primary={value.name} secondary={value.streetNumber + ' ' + value.streetName + ' ' + value.postalCode + ' ' + value.city + ' ' + value.country} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
