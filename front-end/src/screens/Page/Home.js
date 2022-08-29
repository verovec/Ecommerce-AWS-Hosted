import * as React from 'react';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Header from './Header';
import Footer from './Footer';
import Grid from '@mui/material/Grid';
import './Home.css';
import ProductCard from './ProductCard';
import { useEffect } from "react";
import { useProducts } from '../../query/products';
import { useCategories } from '../../query/filter';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function Home() {

    const theme = createTheme();
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    const { mutationAllProducts, data: products, isLoading } = useProducts();
    const [params, setParams] = React.useState({
        name: null,
        states: null,
        fromPrice: null,
        toPrice: null,
        tagNames: null,
        categoryIds: null,
    });
    const { data: categories } = useCategories();
    // const { data: categories } = useCategories();

    const handleChange = (event, value) => {
        setPage(value);
    };

    const getParams = () => {
        let urlParams = "";

        if (params?.name) {
            urlParams += "&name=" + params.name;
        }
        if (params?.states) {
            urlParams += "&states=" + params.states;
        }
        if (params?.fromPrice) {
            urlParams += "&fromPrice=" + params.fromPrice;
        }
        if (params?.toPrice) {
            urlParams += "&toPrice=" + params.toPrice;
        }
        if (params?.tagNames) {
            urlParams += "&tagNames=" + params.tagNames;
        }
        if (params?.categoryIds) {
            urlParams += "&categoryIds=" + params.categoryIds;
        }

        return urlParams;
    }

    useEffect(() => {
        if (params) {
            const urlParams = getParams();
            mutationAllProducts({ params: `&page=${page}${urlParams}` })
        }
    }, [params])

    useEffect(() => {
        const urlParams = getParams();

        mutationAllProducts({ params: `&page=${page}${urlParams}` })
    }, [page]);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" >
                <Header title="My Little Shopping" />

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
                    <Typography variant="h6" gutterBottom>
                        Filtres
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            onChange={(e) => setParams({ ...params, name: e.target.value || null })}
                            style={{ margin: 8 }}
                            margin="normal"
                            id="name"
                            label="Nom"
                            name="name"
                        />
                        Entre
                        <TextField
                            onChange={(e) => setParams({ ...params, fromPrice: e.target.value || null })}
                            style={{ margin: 8 }}
                            margin="normal"
                            id="name"
                            label="Prix bas"
                            name="name"
                        />
                        et
                        <TextField
                            onChange={(e) => setParams({ ...params, toPrice: e.target.value || null })}
                            style={{ margin: 8 }}
                            margin="normal"
                            id="name"
                            label="Prix haut"
                            name="name"
                        />
                        <Select
                            labelId="selectState"
                            id="state"
                            name="state"
                            defaultValue={'ALL'}
                            label="Etat"
                            onChange={(e) => setParams({ ...params, states: e.target.value === "ALL" ? null : e.target.value})}
                        >
                            <MenuItem value={'ALL'}>TOUT</MenuItem>
                            <MenuItem value={'NEW'}>NOUVEAU</MenuItem>
                            <MenuItem value={'OCCASION'}>OCCASION</MenuItem>
                            <MenuItem value={'RECONDITIONED'}>RECONDITIONNE</MenuItem>
                        </Select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {
                            categories && categories?.map((ctg) => (
                                <div onClick={() => setParams({ ...params, categoryIds: params.categoryIds == ctg.id ? null : ctg.id })} style={{ cursor: 'pointer', height: 24, width: 64, paddingLeft: 8, paddingRight: 8, backgroundColor: params.categoryIds == ctg.id ? 'blue' : 'lightgrey', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 8 }}>
                                    <Typography sx={{ fontSize: 14, color: 'white' }} color="white" gutterBottom key={ctg.id}>
                                        {ctg.name}
                                    </Typography>
                                </div>
                            ))
                        }
                    </div>
                    {
                        isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <CircularProgress />
                            </Box>
                        )
                    }
                    {
                        !isLoading && (
                            <>
                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    {
                                        products && products.map(prd => (
                                            <div key={prd.id}>
                                                <ProductCard
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
                                                />
                                            </div>
                                        ))
                                    }
                                </Grid>
                                <Stack spacing={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Pagination onChange={handleChange} page={page} count={10} color="primary" />
                                </Stack>
                            </>
                        )
                    }
                </main>
            </Container>
            <Footer
                title="Footer"
                description=""
            />
        </ThemeProvider>
    );
}
export default Home;
