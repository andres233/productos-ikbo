// material-ui
import { Button, Grid, TextField } from '@mui/material';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    useEffect(() => {
        fetchProducts(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            fetchProducts(1, itemsPerPage);
        }, 1000); // 1000 ms de debounce

        setDebounceTimeout(timeout);

        return () => {
            clearTimeout(timeout); // Limpiar timeout al desmontar
        };
    }, [searchTerm]);


    useEffect(() => {
        fetchProducts(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const fetchProducts = (page, limit) => {
        console.log(page, limit);

        axiosInstance.get('/api/product', {
            params: { page: page, limit, search: searchTerm } // Ajusta según tu API
        })
            .then((response) => {
                if (response.data && response.data.data) {
                    setProducts(response.data.data);
                    setPagination(response.data.meta)
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

    const handleSearch = () => {
        fetchProducts(currentPage, itemsPerPage);
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

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <TextField
                            label="Buscar Producto"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
