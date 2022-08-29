import React, {useEffect} from 'react';
import Header from "./Header";
import Footer from "./Footer";
import AddressForm from "../Checkout/AddressForm";
import {ActionButton} from "../../Utils/ActionButton";
import Typography from "@mui/material/Typography";
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useDisableAccount, useUser} from "../../query";
import {CircularProgress} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import {useNavigate} from "react-router-dom";
import HeaderSeller from "./HeaderSeller";

export const Profil = () => {
    const theme = createTheme();
    const navigate = useNavigate();
    const { user, isLoading, refetch } = useUser();
    const { mutationDisableAccount, data: disableData, isLoading: isLoadingDisable } = useDisableAccount();

    useEffect(() => {
        if (disableData?.success) {
            navigate('/');
        }
    }, [disableData])

    const onDisableAccount = () => {
        mutationDisableAccount();
    }

    if (isLoading) {
        return (
            <CircularProgress />
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                {
                    user?.roles?.isBuyer
                    ?
                        <Header title="My Little Shopping"/>
                    :
                        <HeaderSeller title="My Little Shopping" />
                }
                <main>
                    <div style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 32
                    }}>
                        <Avatar style={{ height: 200, width: 200, borderRadius: 100 }} />
                        <div style={{marginTop: 32}}>
                            <div style={{ fontWeight: 'bold' }}>
                                {user?.name}
                            </div>
                        </div>
                        {
                            user?.roles?.isBuyer && (
                                <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', marginLeft: 32}}>
                                    <Typography variant="h6" gutterBottom>
                                        Adresses
                                    </Typography>
                                </div>
                            )
                        }
                        <div style={{width: '80%', marginTop: 32}}>
                            {
                                user?.roles?.isBuyer && (
                                    <AddressForm canAdd hasTitle={false} hasAddressCheckbox={false} onPressAddButton={() => {}}/>
                                )
                            }
                        </div>
                        <div style={{marginTop: 52}}>
                            {
                                isLoadingDisable && (
                                    <CircularProgress />
                                )
                            }
                            {
                                !isLoadingDisable && (
                                    <ActionButton onPress={onDisableAccount} color="red" title="Désactiver le compte" />
                                )
                            }
                        </div>
                    </div>
                </main>
            </Container>
            <Footer
                title="Footer"
                description=""
            />
        </ThemeProvider>
    )
}
