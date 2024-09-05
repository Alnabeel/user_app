import { Alert, Button, Container, TextField, Typography } from '@mui/material';
import { Client, Databases, Query } from 'appwrite';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const client = new Client();
    const databases = new Databases(client);

    client
        .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
        .setProject('66d2bfe6002a8bb432b3'); // Replace with your Appwrite project ID

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await databases.listDocuments(
                '66d2c2610028fa44c5aa',  // Replace with your database ID
                '66d2c62e000481c93cc4',  // Replace with your employee collection ID
                [Query.equal('email', email)]   // Query to find a document by email
            );

            if (response.documents.length > 0) {
                // Assuming each document contains an 'id' field
                const employeeId = response.documents[0].$id;
                navigate(`/dashboard/${employeeId}`);  // Navigate to the dashboard with employee ID
            } else {
                setError('Email not found. Please try again.');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default Login;
