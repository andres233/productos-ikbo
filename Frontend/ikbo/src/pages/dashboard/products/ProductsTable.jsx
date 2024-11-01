import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import imgProductDefault from 'assets/images/commons/default.png';

// third-party
import { NumericFormat } from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import { useState } from 'react';
import { Button, CardMedia, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TablePagination, TextField } from '@mui/material';
import ModalCreateInventary from '../inventary/ModalCreateInventary';
import { useAuth } from 'contexts/auth/AuthContext';
import axiosInstance from 'api/axiosInstance';
import { LockOutlined, QuestionOutlined, DeleteOutlined, AppstoreAddOutlined   } from '@ant-design/icons';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function formatDateTimezone(date) {
  return (moment.utc(date).tz('America/Bogota')).subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'image',
    align: 'left',
    disablePadding: false,
    label: 'imagen'
  },
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'Id'
  },
  {
    id: 'sku',
    align: 'left',
    disablePadding: false,
    label: 'SKU'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Producto'
  },
  {
    id: 'price',
    align: 'right',
    disablePadding: false,
    label: 'PRECIO'
  },
  {
    id: 'fecha creacion',
    align: 'right',
    disablePadding: false,
    label: 'Fecha Creacion'
  },
  {
    id: 'actions',
    align: 'right',
    disablePadding: false,
    label: ''
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function ProductsTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


// ==============================|| ORDER TABLE ||============================== //

export default function ProductsTable({ data, pagination, onChangePage, onChangeRowsPerPage, fetchProducts }) {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [page, setPage] = useState(0); // Estado para la página
  const [rowsPerPage, setRowsPerPage] = useState(5); // Productos por página
  const [openModalOrder, setOpenModalOrder] = useState(false);
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  // Manejar el cambio de página
  const handleChangePage = (event, newPage) => {
    onChangePage(event, newPage); // Llamar a la función pasada
    setPage(newPage);
  };

  // Manejar el cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    onChangeRowsPerPage(event); // Llamar a la función pasada
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetear a la primera página
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpenModalOrder(true);
  };

  const handleCloseModal = () => {
    setOpenModalOrder(false);
    setSelectedProduct(null);
  };

  const handleRedirectInventory = (id) => {
    navigate(`/inventary/${id}`);
  };

  const createOrder = async (quantity, product) => {
    const newOrder = {
      productId: product.id,
      quantity: parseInt(quantity),
      userId: state.user.id
    };

    try {
      const resp = await axiosInstance.post('/api/order', newOrder);
      fetchProducts(page + 1, rowsPerPage)
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleOpenConfirmDelete = (product) => {
    setSelectedProduct(product);
    setOpenModalConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenModalConfirmDelete(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async () => {
    try {
      await axiosInstance.delete(`/api/product/${selectedProduct.id}`);
      fetchProducts(page + 1, rowsPerPage);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    handleCloseConfirmDelete(); // Cerrar el modal después de eliminar
  };


  var products = [];

  if (data) {
    products = data;
  }


  const order = 'desc';
  const orderBy = 'id';

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <ProductsTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(products, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <CardMedia component="img" image={imgProductDefault} sx={{ width: 50 }} />
                  </TableCell>
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary"> {row.id}</Link>
                  </TableCell>
                  <TableCell>{row.sku}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.price} displayType="text" thousandSeparator prefix="$" />
                  </TableCell>
                  <TableCell align="right">{formatDateTimezone(row.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="success" onClick={() => handleRedirectInventory(row.id)}>
                      <AppstoreAddOutlined  />Inventario
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleOpenConfirmDelete(row)}>
                      <DeleteOutlined  />Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Opciones de filas por página
        component="div"
        count={(pagination && pagination.total) ?? 0} // Total de productos
        rowsPerPage={rowsPerPage} // Filas por página
        page={page} // Página actual
        onPageChange={handleChangePage} // Cambiar página
        onRowsPerPageChange={handleChangeRowsPerPage} // Cambiar filas por página
        labelRowsPerPage="Filas por página"
      />

      <Dialog
        open={openModalConfirmDelete}
        onClose={handleCloseConfirmDelete}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el producto {selectedProduct?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>Cancelar</Button>
          <Button onClick={handleDeleteProduct} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {selectedProduct ?

        <Dialog
          open={openModalOrder}
          onClose={handleCloseModal}
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData).entries());
              const quantity = formJson.quantity;
              handleCloseModal();
              createOrder(quantity, selectedProduct);
            },
          }}
        >
          <DialogTitle>Comprar {selectedProduct.name}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ingrese el numero de unidades que desea comprar
            </DialogContentText>
            <TextField
              autoFocus
              required
              autoComplete='off'
              margin="dense"
              id="quantity"
              name="quantity"
              label="Cantidad"
              type="number"
              inputProps={{
                min: 1, // Valor mínimo
                max: selectedProduct.stock, // Valor máximo
              }}
              sx={{ mt: 2, minWidth: 120 }}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">Comprar</Button>
          </DialogActions>
        </Dialog> : null
      }
    </Box>
  );
}

ProductsTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

