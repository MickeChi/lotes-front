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
import ProyectoCotaModal from "./ProyectoCotaModal.jsx";
import ModalDemo from "./ModalDemo.jsx";

const ProyectoCotaTable = ({fraccionId, proyecto, onChange, cotasSelected}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const cotas = useSelector(state => state.cotas.cotas);
    const [openCotaModal, setOpenCotaModal] = useState(false);
    const [cotaUpdate, setCotaUpdate] = useState(null);
//   onChange={colindanciasHandler} colindanciasSelected={colindsIdsSelect}/>
    const [cotasProyecto, setCotasProyecto] = useState([]);
    useEffect(() => {
        console.log("cotasProyecto Change: ", cotasProyecto);
        onChange(cotasProyecto);

    }, [cotasProyecto]);


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

    useEffect(() => {
        console.log("openCotaModal Change: ", openCotaModal);

    }, [openCotaModal]);

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
                    <ButtonGroup variant="contained"  aria-label="outlined button group">
                        <Button color="warning" title="editar" onClick={()=>{
                            setCotaUpdate(row);
                        }}><Edit/></Button>
                        <Button color="secondary" title="Ver colindancias" onClick={()=>{
                            setCotaUpdate(row);
                        }}><Visibility/></Button>
                    </ButtonGroup>
                );
            },
        },
    ];

    const handleSubmitModal = (cotaForm) => {
        console.log("handleSubmitModal", cotaForm);
        setCotasProyecto([...cotasProyecto, cotaForm]);
    }

    const handlerEditCota = (cotaEdit) => {
        console.log("handlerEditCota: ", cotaEdit);
        setCotaUpdate(cotaEdit);
    }

    return (
        <Box>

            <Box display="flex" justifyContent="space-between">
                <Header subtitle="Cotas proyecto" />
                <Box>
                    <Button
                        size="small"
                        color="warning"
                        variant="contained"
                        onClick={() => {
                            setOpenCotaModal(true);
                        }}
                    >
                        <AddCircle sx={{ mr: "10px" }}/>
                        Agregar cota
                    </Button>
                </Box>
            </Box>

            <Box
                //m="40px 0 0 0"
                height="50vh"
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
                <DataGrid rows={cotasProyecto} columns={columns} getRowId={(row) => row.fraccionId} />
                <ProyectoCotaModal openModal={openCotaModal}
                                   cota={cotaUpdate}
                                   handleEditRow={() =>{}}
                                   handleSubmitModal={handleSubmitModal}
                                   onCloseModal={setOpenCotaModal}
                />
            </Box>

        </Box>
    );
};

export default ProyectoCotaTable;
