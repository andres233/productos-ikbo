import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import axiosInstance from 'api/axiosInstance';
import { useNavigate } from 'react-router-dom';

// ==============================|| CREATE PRODUCT ||============================== //

const CreateProductForm = () => {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newProduct = {
            name,
            sku,
            stock: parseInt(stock, 10),
            price: parseFloat(price),
        };

        try {
            await axiosInstance.post('/api/product', newProduct);
            // Redirigir a la lista de productos después de crear
            navigate('/products');
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={12}>
                <Typography variant="h5">Crear Nuevo Producto</Typography>
            </Grid>
            <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Nombre del Producto"
                                variant="outlined"
                                fullWidth
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="SKU"
                                variant="outlined"
                                fullWidth
                                required
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Stock"
                                variant="outlined"
                                type="number"
                                fullWidth
                                required
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Precio"
                                variant="outlined"
                                type="number"
                                fullWidth
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit">
                                Crear Producto
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default CreateProductForm;