import { Alert, Box, Card, CardContent, CardMedia, CircularProgress, Container, Typography } from '@mui/material';
import { Client } from 'appwrite';
import axios from 'axios';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
    const { employeeId } = useParams(); // Get employeeId from URL params
    const [qrCode, setQRCode] = useState('');
    const [suburb, setSuburb] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const client = new Client();

        client
            .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
            .setProject('66d2bfe6002a8bb432b3'); // Replace with your Appwrite project ID

        const fetchEmployeeData = async () => {
            try {
                // Fetch location from browser geolocation
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const { latitude, longitude } = position.coords;

                        const locationResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                            params: {
                                key: '7478b02988a84ccd93340551d11a755c',
                                q: `${latitude},${longitude}`,
                            },
                        });

                        const results = locationResponse.data.results;
                        if (results.length > 0) {
                            // Extract suburb and city
                            const locationData = results[0].components;
                            const suburb = locationData.suburb || 'Suburb not found';
                            const city = locationData.city || locationData.town || 'City not found';

                            setSuburb(suburb);
                            setCity(city);

                            // Generate QR code
                            const qrData = `${employeeId},${suburb},${city}`;
                            const qrCodeUrl = await QRCode.toDataURL(qrData);
                            setQRCode(qrCodeUrl);
                        } else {
                            setError('Location not found.');
                        }
                        setLoading(false);
                    }, (error) => {
                        setError('Failed to retrieve location.');
                        setLoading(false);
                    });
                } else {
                    setError('Geolocation is not supported by this browser.');
                    setLoading(false);
                }
            } catch (err) {
                setError('Failed to fetch data or generate QR code.');
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [employeeId]); // Depend on employeeId

    return (
        <Container component="main" maxWidth="xs">
            <Typography variant="h4" gutterBottom align="center">
                Employee QR CODE
            </Typography>
            {loading ? (
                (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100vh" // Full viewport height
                    >
                      <CircularProgress />
                    </Box>
                  )
            ) : (
                <Card>
                    <CardContent>
                        {error && <Alert severity="error">{error}</Alert>}
                        {suburb && city && (
                            <Typography variant="h6" gutterBottom>
                                Suburb: {suburb}, City: {city}
                            </Typography>
                        )}
                        {qrCode && (
                            <CardMedia
                                component="img"
                                image={qrCode}
                                alt="Employee QR Code"
                                style={{ maxWidth: '100%', marginTop: '20px' }}
                            />
                        )}
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default Dashboard;
