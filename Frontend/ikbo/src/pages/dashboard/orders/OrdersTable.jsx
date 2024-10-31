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
import { CardMedia, TablePagination } from '@mui/material';

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
        id: 'quantity',
        align: 'right',
        disablePadding: false,
        label: 'Cantidad'
    },
    {
        id: 'price',
        align: 'right',
        disablePadding: false,
        label: 'PRECIO UN.'
    },
    {
        id: 'priceTotal',
        align: 'right',
        disablePadding: false,
        label: 'PRECIO TOTAL'
    },
    {
        id: 'created_at',
        align: 'right',
        disablePadding: false,
        label: 'Fecha'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

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

function timestampToHumanDate(timestamp) {
    console.log(timestamp);
    timestamp = parseInt(timestamp);
    console.log(timestamp);
    var newDate = new Date();
    newDate.setTime(timestamp);
    var dateString = newDate.toLocaleString();
    return dateString;
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrdersTable({ data, pagination, onChangePage, onChangeRowsPerPage }) {

    const [page, setPage] = useState(0); // Estado para la página
    const [rowsPerPage, setRowsPerPage] = useState(5); // Productos por página

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

    var products = [];

    if (data) {
        products = data;
    }
    // if(pagination){
    //   setPage(pagination.page-1);
    //   setRowsPerPage(pagination.perPage)
    // }
    console.log(products)
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
                                    <TableCell>{row.product.sku}</TableCell>
                                    <TableCell>{row.product.name}</TableCell>
                                    <TableCell align="right">{row.quantity}</TableCell>
                                    <TableCell align="right">
                                        <NumericFormat value={row.price} displayType="text" thousandSeparator prefix="$" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <NumericFormat value={row.price * row.quantity} displayType="text" thousandSeparator prefix="$" />
                                    </TableCell>
                                    <TableCell align="right">{timestampToHumanDate(row.createdAt)}</TableCell>
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
        </Box>
    );
}

OrdersTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

