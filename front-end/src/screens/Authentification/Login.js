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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLogin } from '../../query';
import { Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="">
                MyLittleShopping
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Login() {

    const [error, setError] = React.useState(null);
    const [role, setRole] = React.useState(null);
    const { mutationLogin, data, isLoading } = useLogin();

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataForm = new FormData(event.currentTarget);
        mutationLogin({ email: dataForm.get('email'), password: dataForm.get('password') })
    };

    function getRole(user) {
            if(user.roles.isAdmin == true) {
                setRole('admin');
            }
            else if(user.roles.isBuyer == true) {
                setRole('buyer');
            }
            else {
                setRole('seller');
            }
    }

    useEffect(() => {
        if (data?.success) {
            localStorage.setItem('token', data.data.token);
            getRole(data.data.user);
        } else if(data?.error){
            setError('error');
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
        data ?.success && role ? <Navigate to={`/home/${role}`}/> :
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
                            S'identifier
                        </Typography>
                        {error != null &&
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert severity="error">
                                <AlertTitle>Erreur</AlertTitle>
                                L'email ou le mot de passe est invalide !
                            </Alert>
                        </Stack>
                        }
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                S'identifier
                            </Button>
                            <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        {"Vous n'avez pas de compte ? S'inscrire"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
  );
}
