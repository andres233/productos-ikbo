import React, { useState } from 'react';
import { Modal, Box, Button, Typography, TextField } from '@mui/material';

const ModalCreateOrder = ({ open, handleClose, product, onConfirm }) => {
    console.log(product);
    
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const value = Math.min(e.target.value, product.stock); // Asegúrate de no exceder el stock
    setQuantity(value);
  };

  const handleConfirm = () => {
    onConfirm(quantity);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ /* estilos para el modal */ padding: 2 }}>
        <Typography variant="h6">Comprar {product.name??''}</Typography>
        <TextField
          type="number"
          label="Cantidad"
          value={quantity}
          onChange={handleQuantityChange}
          inputProps={{ min: 1, max: product.stock }} // Limitar el rango
        />
        <Button onClick={handleConfirm}>Aceptar</Button>
        <Button onClick={handleClose}>Cancelar</Button>
      </Box>
    </Modal>
  );
};

export default ModalCreateOrder;