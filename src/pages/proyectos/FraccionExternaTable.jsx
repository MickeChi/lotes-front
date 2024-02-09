import {Box, Button, ButtonGroup, Typography, useTheme} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme.jsx";
import Header from "../../components/Header";
import {useDispatch, useSelector} from "react-redux";
import {Edit, Visibility, AllOut, CreateNewFolderOutlined, AddCircle} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {getAllCotas, setCotas} from "../../store/slices/cotaSlice.js";
import {Link} from "react-router-dom";
import FraccionExternaModal from "./FraccionExternaModal.jsx";
import ModalDemo from "./ModalDemo.jsx";

const FraccionExternaTable = ({handleEditRow, fraccionesExternas}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    //const dispatch = useDispatch();
    //onChange={colindanciasHandler} colindanciasSelected={colindsIdsSelect}/>
    const [fraccionesExtTable, setFraccionesExtTable] = useState([]);
    useEffect(() => {
        console.log("fraccionesExternas Change: ", fraccionesExternas);
        setFraccionesExtTable(fraccionesExternas);

    }, [fraccionesExternas]);

    const columns = [
        {
            field: "orden",
            headerName: "Orden",
            type: "number",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "descripcion",
            headerName: "Descripción",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "tipoLinea",
            headerName: "Tipo Linea",
            flex: 1,
        },
        {
            field: "orientacion",
            headerName: "Rumbo",
            flex: 1,
        },
        {
            field: "medida",
            headerName: "Distancia",
            flex: 1,
        },
        {
            field: "opciones",
            headerName: "Opciones",
            flex: 1,
            renderCell: ({ row }) => {
                return (
                    <ButtonGroup size="small" variant="contained"  aria-label="outlined button group">
                        <Button color="warning" title="editar" onClick={()=>{
                            onClikEdit(row);
                        }}><Edit/></Button>
                        {/*<Button color="secondary" title="Ver colindancias" onClick={()=>{
                            onClikEdit(row);
                        }}><Visibility/></Button>*/}
                    </ButtonGroup>
                );
            },
        },
    ];

    const onClikEdit = (fracExtEdit) => {
        console.log("onClikEdit fracExtEdit", fracExtEdit)
        handleEditRow(fracExtEdit);
    }

    return (
            <Box
                //m="40px 0 0 0"
                height="40vh"
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
                    "& .Mui-selected": {
                        backgroundColor: `#3d475b !important`
                    }
                }}
            >
                <DataGrid rows={fraccionesExtTable}
                          columns={columns}
                          getRowId={(row) => row.fraccionId}
                />
            </Box>
    );
};

export default FraccionExternaTable;
