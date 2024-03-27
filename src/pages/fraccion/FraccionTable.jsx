import {Box, Button, ButtonGroup, useTheme} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme.jsx";
import Header from "../../components/Header";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setLoader} from "../../store/slices/generalSlice.js";
import {getAllFracciones} from "../../store/slices/fraccionSlice.js";
import {Edit} from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const FraccionTable = ({proyectoId, handleEditRow}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const fracciones = useSelector(state => state.fracciones.fracciones);
    const [fraccionesTabla, setFraccionesTabla] = useState([]);

    useEffect(() => {
        console.log("proyectoId: ", proyectoId);
        dispatch(setLoader(true));
        dispatch(getAllFracciones({proyectoId: proyectoId}))
            .then(resp => {
                dispatch(setLoader(false));
            })
    }, []);

    useEffect(() => {
        if(fracciones.length > 0){
            let fraccTabla = fracciones.filter(f => !f.colindanciaProyecto);
            setFraccionesTabla(fraccTabla);
        }

    }, [fracciones]);

    const columns = [
        {
            field: "lote",
            headerName: "Lote",
            flex: 1,
        },
        {
            field: "numeroCatastral",
            headerName: "Num Catastral",
            flex: 1,
        },
        {
            field: "folioElectronico",
            headerName: "Folio electrónico",
            flex: 1,
        },
        {
            field: "superficieTerreno",
            headerName: "Sup. terreno",
            flex: 1,
        },
        {
            field: "valorCatastral",
            headerName: "Valor catastral",
            flex: 1,
        },
        {
            field: "uso",
            headerName: "Uso",
            flex: 1,
        },
        {
            field: "clase",
            headerName: "Clase",
            flex: 1,
        },
        {
            field: "tipoColindancia",
            headerName: "Tipo colindancia",
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
                        <Button color="error" title="Eliminar" onClick={()=>{
                            alertaEliminar(row);
                        }}><DeleteForeverIcon/></Button>
                    </ButtonGroup>
                );
            },
        },
    ];

    const alertaEliminar = (fraccionEdit) => {

        console.log("alertaEliminar", fraccionEdit);
        withReactContent(Swal).fire({
            title: "¿Está seguro de eliminar?",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            denyButtonText: `Cancelar`
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("SE CONFIRMA ELIMINACIÓN")
                handleEditRow(fraccionEdit, true);
            }
        });
    }

    const onClikEdit = (fraccionEdit) => {
        handleEditRow(fraccionEdit);
    }

    return (
        <Box>
            <Header subtitle="Unidades" />
            <Box
                //m="40px 0 0 0"
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
                    "& .Mui-selected": {
                        backgroundColor: `#3d475b !important`
                    }
                }}
            >
                <DataGrid rows={fraccionesTabla} columns={columns} />
            </Box>
        </Box>
    );
};

export default FraccionTable;
