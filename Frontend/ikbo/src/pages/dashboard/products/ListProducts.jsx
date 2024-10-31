// material-ui
import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import axiosInstance from 'api/axiosInstance';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import ProductsTable from './ProductsTable';
import { useNavigate } from 'react-router';

// ==============================|| SAMPLE PAGE ||============================== //

export default function ListProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState();
    const [pagination, setPagination] = useState();
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [itemsPerPage, setItemsPerPage] = useState(5); // Productos por página

    useEffect(() => {
        console.log(currentPage, itemsPerPage);

        fetchProducts(currentPage,itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const fetchProducts = (page,limit) => {
        axiosInstance.get('/api/product', {
            params: { page: page, limit } // Ajusta según tu API
        })
            .then((response) => {
                if (response.data && response.data.data) {
                    setProducts(response.data.data);
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

    const handleCreateProduct = () => {
        navigate('/create-product'); // Redirige al formulario de creación
    };

    return (
        <MainCard>
            {/* row 3 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Catalogo de Productos</Typography>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleCreateProduct}
                        >
                            Crear Nuevo Producto
                        </Button>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <ProductsTable
                        data={products}
                        pagination={pagination}
                        onChangePage={handleChangePage} // Pasar la función de cambio de página
                        onChangeRowsPerPage={handleChangeRowsPerPage} // Pasar la función para cambiar filas por página
                        fetchProducts={fetchProducts}
                    />
                </MainCard>
            </Grid>
        </MainCard>
    );
}
