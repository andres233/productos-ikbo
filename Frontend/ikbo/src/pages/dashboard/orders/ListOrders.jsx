// material-ui
import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import axiosInstance from 'api/axiosInstance';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import OrdersTable from './OrdersTable';
import { useNavigate } from 'react-router';

// ==============================|| SAMPLE PAGE ||============================== //

export default function ListOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState();
    const [pagination, setPagination] = useState();
    const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage, setItemsPerPage] = useState(5); 

    useEffect(() => {
        console.log(currentPage, itemsPerPage);

        fetchOrders(currentPage,itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const fetchOrders = (page,limit) => {
        axiosInstance.get('/api/order', {
            params: { page: page, limit } // Ajusta según tu API
        })
            .then((response) => {
                if (response.data && response.data.data) {
                    setOrders(response.data.data);
                    setPagination(response.data.pagination)
                }
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage + 1); // Aumentar el número de página por 1 (si es 0-indexado)
    };

    const handleChangeRowsPerPage = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1); // Resetear a la primera página
    };

    return (
        <MainCard>
            {/* row 3 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Gestion de Ventas</Typography>
                    </Grid>
                    <Grid item/>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <OrdersTable
                        data={orders}
                        pagination={pagination}
                        onChangePage={handleChangePage} // Pasar la función de cambio de página
                        onChangeRowsPerPage={handleChangeRowsPerPage} // Pasar la función para cambiar filas por página
                    />
                </MainCard>
            </Grid>
        </MainCard>
    );
}