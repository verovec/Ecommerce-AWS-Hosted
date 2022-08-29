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

export default function AddressForm({ hasTitle = true, hasAddressCheckbox = true, onPressAddButton, canAdd = false }) {
    const { mutationAddresses, data: addresses } = useAddresses();
    const { mutationAddAddress, data, isLoading } = useAddAddress();
    const { mutationRemoveAddress, data: removedData, isLoading: isLoadingRemove } = useRemoveAddress();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");

    useEffect(() => {
        mutationAddresses(localStorage.getItem('token'), { params: '' });
    }, []);

    useEffect(() => {
        if (removedData?.success) {
            mutationAddresses(localStorage.getItem('token'), { params: '' });
        }
    }, [removedData])

    useEffect(() => {
        if (data?.success) {
            mutationAddresses(localStorage.getItem('token'), { params: '' });
            setName("");
            setAddress("")
            setNumber("")
            setCity("")
            setPostalCode("")
            setCountry("")
        }
    }, [data])

    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        localStorage.removeItem('addressId')
        localStorage.setItem('addressId', index);
    };

    const onAddAddress = () => {
        const token = localStorage.getItem('token');

        const params = {
            country,
            city,
            streetName: address,
            streetNumber: number,
            postalCode,
            name
        }

        mutationAddAddress(token, { params })
    }

    const canAddButton = () => {
        return (Boolean(name) && Boolean(address) && Boolean(number) && Boolean(city) && Boolean(postalCode) && Boolean(country))
    }

    const onRemoveAddress = (addressId) => {
        const token = localStorage.getItem('token');
        mutationRemoveAddress(token, { addressId })
    }

    return (
        <React.Fragment>
          {
            hasTitle && (
                <Typography variant="h6" gutterBottom>
                  Adresses de livraison
                </Typography>
            )
          }
            <Grid container spacing={3}>
                <Grid item xs={12}>

                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {addresses && addresses.map((value) => {
                            return (
                                <ListItem key={value.id} disablePadding>
                                    <ListItemButton
                                        selected={selectedIndex === value.id}
                                        onClick={(event) => handleListItemClick(event, value.id)}
                                    >
                                        <ListItemText primary={value.name} secondary={value.streetNumber + ' ' + value.streetName + ' ' + value.postalCode + ' ' + value.city + ' ' + value.country} />
                                    </ListItemButton>
                                    {
                                        isLoadingRemove && (
                                            <CircularProgress />
                                        )
                                    }
                                    {
                                        !isLoadingRemove && (
                                            <div style={{ cursor: 'pointer', height: 32, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => onRemoveAddress(value.id)}>
                                                <div style={{ width: 20, height: 2, backgroundColor: 'red' }} />
                                            </div>
                                        )
                                    }
                                </ListItem>
                            );
                        })}
                        {
                            canAdd && (
                                <div>
                                    <Box component="form"
                                         sx={{ width: 600, borderRadius: 10, display: 'flex' }}
                                         noValidate
                                    >
                                        <TextField
                                            onChange={(e) => setName(e.target.value)}
                                            style={{ margin: 8 }}
                                            margin="normal"
                                            id="name"
                                            label="Nom"
                                            name="name"
                                            value={name}
                                        />
                                        <TextField
                                            onChange={(e) => setAddress(e.target.value)}
                                            style={{ margin: 8 }}
                                            margin="normal"
                                            id="rue"
                                            label="Rue"
                                            name="rue"
                                            value={address}
                                        />
                                        <TextField
                                            onChange={(e) => setNumber(e.target.value)}
                                            style={{ margin: 8 }}
                                            margin="normal"
                                            id="number"
                                            label="Numéro"
                                            name="number"
                                            value={number}
                                        />
                                        <TextField
                                            onChange={(e) => setCity(e.target.value)}
                                            style={{ margin: 8 }}
                                            margin="normal"
                                            id="city"
                                            label="Ville"
                                            name="city"
                                            value={city}
                                        />
                                        <TextField
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            style={{ margin: 8 }}
                                            margin="normal"
                                            id="postal"
                                            label="Code Postal"
                                            name="postal"
                                            value={postalCode}
                                        />
                                        <TextField
                                            onChange={(e) => setCountry(e.target.value)}
                                            style={{ margin: 8 }}
                                            margin="normal"
                                            id="country"
                                            label="Pays"
                                            name="country"
                                            value={country}
                                        />
                                    </Box>
                                    {
                                        isLoading && (
                                            <CircularProgress />
                                        )
                                    }
                                    {
                                        !isLoading && (
                                            <Button onClick={onAddAddress} variant="outlined" disabled={!canAddButton()} size="small" style={{ marginLeft: 8 }}>
                                                Ajouter
                                            </Button>
                                        )
                                    }
                                </div>
                            )
                        }
                    </List>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
