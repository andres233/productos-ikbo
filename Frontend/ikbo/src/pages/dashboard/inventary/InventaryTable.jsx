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
import axiosInstance from 'api/axiosInstance';
import { Button, CardMedia, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, TablePagination } from '@mui/material';
// third-party
import { NumericFormat } from 'react-number-format';
import moment from 'moment-timezone';


import { useState } from 'react';
import { LockOutlined, QuestionOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';

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
        id: 'id',
        align: 'left',
        disablePadding: false,
        label: 'Id'
    },
    {
        id: 'quantity',
        align: 'center',
        disablePadding: false,
        label: 'Cantidad'
    },
    {
        id: 'Estado',
        align: 'center',
        disablePadding: false,
        label: 'ESTADO'
    },
    {
        id: 'expired_at',
        align: 'center',
        disablePadding: false,
        label: 'Fecha Vencimiento'
    },
    {
        id: 'created_at',
        align: 'center',
        disablePadding: false,
        label: 'Fecha Creacion'
    },
    {
        id: 'actions',
        align: 'center',
        disablePadding: true,
        label: 'Acciones'
    }
];

// ==============================|| Inventory TABLE - HEADER ||============================== //

function OrdersTableHead({ order, orderBy }) {
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

function formatDateTimezone(date) {
    return (moment.utc(date).tz('America/Bogota')).subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
}

// ==============================|| ORDER TABLE ||============================== //

export default function InventaryTable({ data, pagination, productId, onChangePage, onChangeRowsPerPage, fetchInventaries }) {
    const [selectedInventary, setSelectedInventary] = useState(null);
    const [selectedTypeInventary, setSelectedTypeInventary] = useState(null);
    const [openModalInventary, setOpenModalInventary] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Manejar el cambio de página
    const handleChangePage = (event, newPage) => {
        onChangePage(event, newPage);
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        onChangeRowsPerPage(event);
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    var products = [];

    if (data) {
        products = data;
    }


    const handleOpenModal = (inventary, type) => {
        setSelectedInventary(inventary);
        setOpenModalInventary(true);
        setSelectedTypeInventary(type)
    };

    const handleCloseModal = () => {
        setOpenModalInventary(false);
        setSelectedInventary(null);
        setSelectedTypeInventary(null);
    };

    const createInventary = async (quantity, inventory, type) => {
        if (type == 'remove') {
            quantity = quantity * (-1);
        }
        const newInventory = {
            quantity: parseInt(quantity),
            expiredAt: inventory.expiredAt
        };

        try {
            const resp = await axiosInstance.post('/api/product/' + productId + '/inventory', newInventory);
            fetchInventaries(page + 1, rowsPerPage)
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const order = 'asc';
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
                    <OrdersTableHead order={order} orderBy={orderBy} />
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
                                        <Link color="secondary"> {row.id}</Link>
                                    </TableCell>
                                    <TableCell align="center">{row.quantity}</TableCell>
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center">{row.expiredAt}</TableCell>
                                    <TableCell align="center">{formatDateTimezone(row.createdAt)}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained" color="success" onClick={() => handleOpenModal(row, 'add')}>
                                            <PlusOutlined />
                                        </Button>
                                        <Button variant="contained" color="error" onClick={() => handleOpenModal(row, 'remove')}>
                                            <MinusOutlined />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={(pagination && pagination.total) ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
            />

            {selectedInventary ?
                <Dialog
                    open={openModalInventary}
                    onClose={handleCloseModal}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData).entries());
                            const quantity = formJson.quantity;
                            handleCloseModal();
                            createInventary(quantity, selectedInventary, selectedTypeInventary);
                        },
                    }}
                >
                    <DialogTitle>
                        {selectedTypeInventary == 'remove' ? "Disminuir Inventario" : "Agregar Inventario"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {selectedTypeInventary == 'remove' ? "Ingrese el numero de unidades que desea sacar del inventario" : "Ingrese el numero de unidades que desea agregar"}
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
                                max: (selectedTypeInventary == 'remove' ? selectedInventary.quantity : null)
                            }}
                            sx={{ mt: 2, minWidth: 120 }}
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit">Guardar</Button>
                    </DialogActions>
                </Dialog> : null
            }
        </Box>
    );
}

OrdersTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

