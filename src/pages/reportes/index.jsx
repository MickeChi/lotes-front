import {Box, Button, FormControl, InputLabel, Select, Typography, useTheme} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme.jsx";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import MenuItem from '@mui/material/MenuItem';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import {Link} from "react-router-dom";
import {CreateNewFolderOutlined} from "@mui/icons-material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined.js";
import {DatePicker} from "@mui/x-date-pickers";
import {useState} from "react";
import moment from "moment/moment.js";

const Reportes = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [tipoReporte, setTipoReporte] = useState('');

    const handleChange = (event) => {
        setTipoReporte(event.target.value);
    };

    const columns = [
        { field: "id", headerName: "ID" },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "phone",
            headerName: "Phone Number",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "cost",
            headerName: "Cost",
            flex: 1,
            renderCell: (params) => (
                <Typography color={colors.greenAccent[500]}>
                    ${params.row.cost}
                </Typography>
            ),
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        },
    ];



    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="REPORTES" subtitle="Generación de reportes" />

                <Box gap="10px" display="grid" gridTemplateColumns="repeat(5, 1fr)">
                    <FormControl variant="filled" sx={{ minWidth: 120 }} size="small" color="secondary">
                        <InputLabel id="demo-simple-select-filled-label">Tipo reporte</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={tipoReporte}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={1}>Por Usuario</MenuItem>
                            <MenuItem value={2}>Por empresa</MenuItem>
                            <MenuItem value={3}>Por operaciones</MenuItem>
                            <MenuItem value={3}>Por entidades</MenuItem>
                        </Select>
                    </FormControl>

                    <DatePicker
                        label="Fecha inicio"
                        defaultValue={moment()}
                        slotProps={{
                            openPickerIcon: { fontSize: 'large' },
                            openPickerButton: { color: 'secondary' },
                            textField: {
                                variant: 'filled',
                                color: 'secondary',
                                size: 'small'
                            },
                        }} />

                    <DatePicker
                        label="Fecha fin"
                        defaultValue={moment()}
                        slotProps={{
                            openPickerIcon: { fontSize: 'large' },
                            openPickerButton: { color: 'secondary' },
                            textField: {
                                variant: 'filled',
                                color: 'secondary',
                                size: 'small'
                            },
                        }} />
                    <Button
                        sx={{
                            //backgroundColor: colors.greenAccent[700],
                            //color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        color="secondary" variant="contained"
                    >
                        <ManageSearchIcon sx={{ mr: "10px" }} />
                        Buscar
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        variant="contained"
                    >
                        <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                        Descargar
                    </Button>
                </Box>
            </Box>
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid checkboxSelection rows={mockDataInvoices} columns={columns} />
            </Box>
        </Box>
    );
};

export default Reportes;
