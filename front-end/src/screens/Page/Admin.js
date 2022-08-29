import React from 'react';
import HeaderAdmin from "./HeaderAdmin";
import Typography from "@mui/material/Typography";
import {Box, Card, CardContent, List} from "@mui/material";
import {useUser, useUsers} from "../../query";
import {useNavigate} from "react-router-dom";

export const getRole = (roles) => {
    if (roles?.isAdmin) {
        return "Admin"
    }

    if (roles?.isSeller) {
        return "Vendeur"
    }

    return "Acheteur"
}

const Admin = () => {
    const { users, isLoading, refetch } = useUsers();
    const navigate =  useNavigate();

    const onPressUser = (userId) => {
       navigate('/home/admin/' + userId);
    }

    return (
        <div>
            <HeaderAdmin title="Panel Admin" />
            <div style={{ width: '100%', marginLeft: 32}}>
                <Typography variant="h6" gutterBottom>
                    Utilisateurs
                </Typography>
                <List sx={{ bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {users?.map((user) => (
                    <Box className="card" onClick={() => onPressUser(user.id)}>
                    <Card variant="outlined">
                        <div style={{ width: 300, height: 56, margin: 16, display: 'flex' }}>
                            <div style={{ display: 'flex', flex: 1, alignItems: 'center', fontWeight: 'bold' }}>
                                Nom
                            </div>
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                {user.name}
                            </div>
                        </div>
                        <div style={{ width: 300, height: 56, margin: 16, display: 'flex' }}>
                            <div style={{ display: 'flex', flex: 1, alignItems: 'center', fontWeight: 'bold' }}>
                                Email
                            </div>
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                {user.email}
                            </div>
                        </div>
                        <div style={{ width: 300, height: 56, margin: 16, display: 'flex' }}>
                            <div style={{ display: 'flex', flex: 1, alignItems: 'center', fontWeight: 'bold' }}>
                                Role
                            </div>
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                {getRole(user?.roles)}
                            </div>
                        </div>
                    </Card>
                    </Box>
                ))}
                </List>
            </div>
        </div>
    )
}

export default Admin;
