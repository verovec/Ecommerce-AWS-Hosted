import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import Review from './Review';
import Header from '../Page/Header';
import {useCreateOrder} from "../../query/order";
import {useEffect} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {useCart} from "../../query/cart";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
      MyLittleShopping
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const steps = ['Adresse de livraison', 'Vérifiez votre commande'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
        return <Review />;
    default:
      throw new Error('Unknown step');
  }
}

const theme = createTheme();

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);
  const { mutationCreateOrder, data, isLoading } = useCreateOrder();
  const { refetch } = useCart();

  useEffect(() => {
      if (data?.success) {
          refetch();
          setActiveStep(activeStep + 1);
      }
  }, [data])

  const handleNext = () => {
      if (activeStep + 1 === steps?.length) {
          const token = localStorage.getItem('token');
          const addressId = localStorage.getItem('addressId');

          mutationCreateOrder(token, { addressId })
      } else {
          setActiveStep(activeStep + 1);
      }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header title="My Little Shopping" />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Commande
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Merci pour votre commande.
                </Typography>
                <Typography variant="subtitle1">
                  Nous venons de vous envoyer un e-mail de
                  confirmation !
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Retour
                    </Button>
                  )}

                    {
                        !isLoading && (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 3, ml: 1 }}
                            >
                                {activeStep === steps.length - 1 ? 'Passer la commande' : 'Suivant'}
                            </Button>
                        )
                    }
                    {
                        isLoading && (
                            <CircularProgress />
                        )
                    }
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}
