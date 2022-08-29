import * as React from 'react';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Header from './Header';
import Footer from './Footer';
import Grid from '@mui/material/Grid';
import './Home.css';
import ProductCardSeller from './ProductCardSeller';
import {useEffect, useState} from "react";
import {useCreateProduct, useProducts} from '../../query/products';
import { useUser } from '../../query';
import { useCategories } from '../../query/filter';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import HeaderSeller from '../Page/HeaderSeller';
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CustomizedHook from "../../Utils/CustomizedHook";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

function ProductsSeller() {

    const theme = createTheme();
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    const { mutationAllProducts, data: products, isLoading } = useProducts();
    const { user: user } = useUser();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [open, setOpen] = React.useState(false);
    const { data } = useCategories();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [states, setStates] = React.useState('');
    const { mutationCreateProduct, data: createProduct } = useCreateProduct();

    useEffect(() => {
        if (createProduct?.success) {
            mutationAllProducts({ params: `&page=${page}&userIds=${user?.id}` });
        }
    }, [createProduct]);

    const onRefresh = () => {
        mutationAllProducts({ params: `&page=${page}&userIds=${user?.id}` });
    }

    const handleChangeStates = (event) => {
        setStates(event.target.value);
    };

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataForm = new FormData(event.currentTarget);
        handleClose();
        const dFtags = dataForm.get('tags');
        const tags = dFtags?.split(',')?.map((t) => {
            return {
                name: t
            }
        });

        const params = {
            price: dataForm.get('price'),
            name: dataForm.get('name'),
            categories: selectedCategories || [],
            tags,
            quantity: dataForm.get('quantity'),
            mark: dataForm.get('mark'),
            description: dataForm.get('description'),
            state: dataForm.get('state')
        };

        mutationCreateProduct({ ...params });
    };

    useEffect(() => {
        mutationAllProducts({ params: `&page=${page}&userIds=${user?.id}` });
    }, [user, page]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" >
                <HeaderSeller title="My Little Shopping"/>
                <Stack spacing={3} sx={{ width: 500 }}>
                    {/* <Autocomplete
                        multiple
                        id="tags-standard"
                        options={categories}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Catégories"
                                placeholder="Catégories"
                            />
                        )}
                    /> */}
                </Stack>
                <main>
                    <Button onClick={handleOpen}>Créer un produit</Button>
                    <Grid container spacing={0} sx={{ mt: 1 }}>
                        {
                            products && products?.map(prd => (
                                <div key={prd.id}>
                                    <ProductCardSeller
                                        id={prd.id}
                                        name={prd.name}
                                        description={prd.description}
                                        price={prd.price}
                                        state={prd.state}
                                        quantity={prd.quantity}
                                        mark={prd.mark}
                                        categories={prd.categories}
                                        tags={prd.tags}
                                        rating={prd.ratingAverage}
                                        onRefresh={onRefresh}
                                    />
                                </div>
                            ))
                        }
                    </Grid>
                    <Stack spacing={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Pagination onChange={handleChange} page={page} count={10} color="primary" />
                    </Stack>
                </main>
            </Container>
            <Footer
                title="Footer"
                description=""
            />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">

                <Box component="form"
                     sx={{ minWidth: 150, position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%)',bgcolor:'background.paper',borderRadius:'10px',boxShadow:24,p:9,}}
                     onSubmit={handleSubmit}
                     noValidate
                >
                    <Typography sx={{ mb: 2 }} id="modal-modal-title" variant="h6" component="h2">
                        Création
                    </Typography>
                    <TextField
                        margin="normal"
                        id="name"
                        label="Nom"
                        name="name"
                    />
                    <TextField
                        margin="normal"
                        id="description"
                        label="Description"
                        name="description"
                    />
                    <TextField
                        margin="normal"
                        id="price"
                        label="Prix"
                        name="price"
                        type="number"
                        min="1"
                    />
                    <TextField
                        margin="normal"
                        id="quantity"
                        label="Quantity"
                        name="quantity"
                        type="number"
                        min="1"
                    />
                    <TextField
                        margin="normal"
                        id="quantity"
                        label="Mark"
                        name="mark"
                    />
                    <TextField
                        margin="normal"
                        id="tags"
                        label="Tags"
                        name="tags"
                    />
                    <CustomizedHook onChangeValue={setSelectedCategories} obj={data} id="categories" name="categories" />
                    <Select
                        labelId="selectState"
                        id="state"
                        name="state"
                        label="Etat"
                        defaultValue="NEW"
                    >
                        <MenuItem value={'NEW'}>NOUVEAU</MenuItem>
                        <MenuItem value={'OCCASION'}>OCCASION</MenuItem>
                        <MenuItem value={'RECONDITIONED'}>RECONDITIONNE</MenuItem>
                    </Select>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 20, mb: 2 }}
                    >
                        Créer
                    </Button>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}
export default ProductsSeller;
