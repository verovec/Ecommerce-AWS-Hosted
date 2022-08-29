import * as React from 'react';
import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRegister } from '../../query';
import { Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="">
                MyLittleShopping
            </Link>
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function convertDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();

    var newdate = year + "-" + month + "-" + day;
    return newdate;
}

const theme = createTheme();

export default function Register() {
    const { mutationRegister, data, isLoading } = useRegister();
    const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));
    const handleSubmit = (event) => {
        event.preventDefault();
        const dataForm = new FormData(event.currentTarget);

        mutationRegister({
            name: dataForm.get('firstName') + ' ' + dataForm.get('lastName'),
            password: dataForm.get('password'),
            birthDate: convertDate(value),
            email: dataForm.get('email')
        });
    };

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (data ?.success) {
            localStorage.setItem('token', data.data.token);
            console.log("SUCCESS");
        } else {
            console.log("ERROR");
        }
    }, [data])

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        data ?.success ? <Navigate to='/home/buyer' /> :
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            S'inscrire
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="Prénom"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Nom"
                                        name="lastName"
                                        autoComplete="family-name"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DesktopDatePicker
                                            label="Date d'anniversaire"
                                            inputFormat="dd/MM/yyyy"
                                            id="birthDate"
                                            value={value}
                                            onChange={handleChange}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Mot de passe"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                S'inscrire
                            </Button>
                            <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Grid item>
                                    <Link href="/#" variant="body2">
                                        Vous avez déjà un compte? S'identifier
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 5 }} />
                </Container>
            </ThemeProvider>
  );
}
