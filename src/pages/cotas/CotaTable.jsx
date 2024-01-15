import {Box, Button, ButtonGroup, Typography, useTheme} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme.jsx";
import Header from "../../components/Header";
import {useDispatch, useSelector} from "react-redux";
import {Edit, Visibility} from "@mui/icons-material";
import {useEffect} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {getAllCotas, setCotas} from "../../store/slices/cotaSlice.js";

const CotaTable = ({fraccionId, handleEditRow}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const cotas = useSelector(state => state.cotas.cotas);

    useEffect(() => {
        const cargarCotas = ()=>{
            dispatch(setLoader(true));
            dispatch(getAllCotas({fraccionId: fraccionId})).then(resp => {
                dispatch(setLoader(false));
            })
        }
        if(fraccionId) {
            cargarCotas();
        }else{
            dispatch(setCotas([]));
        }

    }, [fraccionId]);

    const columns = [
        {
            field: "orden",
            headerName: "Orden",
            type: "number",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "fraccionId",
            headerName: "FraccionId",
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
                    <ButtonGroup variant="contained"  aria-label="outlined button group">
                        <Button color="warning" title="editar" onClick={()=>{
                            onClikEdit(row);
                        }}><Edit/></Button>
                    </ButtonGroup>
                );
            },
        },
    ];

    const onClikEdit = (cotaEdit) => {
        console.log("cotaEdit", cotaEdit)
        handleEditRow(cotaEdit);
    }

    return (
        <Box>
            <Header subtitle="Cotas" />
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
                <DataGrid rows={cotas} columns={columns} />
            </Box>
        </Box>
    );
};

export default CotaTable;
