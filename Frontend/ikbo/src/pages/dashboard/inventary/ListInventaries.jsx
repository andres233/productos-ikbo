// material-ui
import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import axiosInstance from 'api/axiosInstance';
import { useParams } from 'react-router-dom';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import InventaryTable from './InventaryTable';
import { useNavigate } from 'react-router';
import { CardMedia, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

export default function ListInventaries() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [inventaries, setInventaries] = useState();
    const [pagination, setPagination] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [openModalNewLote, setOpenModalNewLote] = useState(false);
    const [cantidadLote, setCantidadLote] = useState('');
    const [fechaVencimientoLote, setFechaVencimientoLote] = useState('');

    useEffect(() => {
        console.log(currentPage, itemsPerPage);

        fetchInventaries(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const fetchInventaries = (page, limit) => {
        axiosInstance.get('/api/product/' + productId + '/inventory', {
            params: { page: page, limit }
        })
            .then((response) => {
                if (response.data && response.data.data) {
                    setInventaries(response.data.data);
                    setPagination(response.data.meta)
                }
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleCreateInventory = () => {
        handleOpenModal();
    };

    const handleOpenModal = () => {
        setOpenModalNewLote(true);
    };

    const handleCloseModal = () => {
        setOpenModalNewLote(false);
        setCantidadLote('');
        setFechaVencimientoLote('');
    };

    const handleSave = async() => {
        const newInventory = {
            quantity: parseInt(cantidadLote),
            expiredAt: fechaVencimientoLote
        };

        try {
            const resp = await axiosInstance.post('/api/product/' + productId + '/inventory', newInventory);
            fetchInventaries(1, 5)
        } catch (error) {
            console.error('Error creating inventory:', error);
        }

        handleCloseModal(); // Cerrar el modal después de guardar
    };

    return (
        <MainCard>
            {/* row 3 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Gestion de Inventario</Typography>
                    </Grid>
                    <Grid item />
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateInventory}
                        >
                            Agregar Lote
                        </Button>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <InventaryTable
                        data={inventaries}
                        pagination={pagination}
                        productId={productId}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        fetchInventaries={fetchInventaries}
                    />
                </MainCard>
            </Grid>

            <Dialog open={openModalNewLote} onClose={handleCloseModal}>
                <DialogTitle>Agregar Lote</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        label="Cantidad"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={cantidadLote}
                        inputProps={{
                            min: 1, // Valor mínimo
                        }}
                        onChange={(e) => setCantidadLote(e.target.value)}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Fecha de Vencimiento"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={fechaVencimientoLote}
                        onChange={(e) => setFechaVencimientoLote(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            min: new Date().toISOString().split('T')[0] // Establecer la fecha mínima
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary" disabled={!cantidadLote || cantidadLote < 0 || !fechaVencimientoLote}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
}