import {Box, Button, ButtonGroup, useTheme} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme.jsx";
import Header from "../../components/Header";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setLoader} from "../../store/slices/generalSlice.js";
import {getAllFracciones} from "../../store/slices/fraccionSlice.js";
import {Edit} from "@mui/icons-material";

const FraccionTable = ({proyectoId, handleEditRow}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const fracciones = useSelector(state => state.fracciones.fracciones);

    useEffect(() => {
        console.log("proyectoId: ", proyectoId);
        dispatch(setLoader(true));
        dispatch(getAllFracciones({proyectoId: proyectoId}))
            .then(resp => {
                dispatch(setLoader(false));
            })
    }, []);

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
                    <ButtonGroup variant="contained"  aria-label="outlined button group">
                        <Button color="warning" title="editar" onClick={()=>{
                            onClikEdit(row);
                        }}><Edit/></Button>
                        {/*<Button color="error"><DeleteForever/></Button>*/}
                    </ButtonGroup>
                );
            },
        },
    ];

    const onClikEdit = (fraccionEdit) => {
        handleEditRow(fraccionEdit);
    }

    return (
        <Box>
            <Header subtitle="Fracciones" />
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
                <DataGrid rows={fracciones} columns={columns} />
            </Box>
        </Box>
    );
};

export default FraccionTable;
