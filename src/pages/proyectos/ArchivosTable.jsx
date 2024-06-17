import {Box, Button, ButtonGroup, Typography, useTheme} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme.jsx";
import Header from "../../components/Header";
import {useDispatch, useSelector} from "react-redux";
import {Edit, Visibility, AllOut} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {getAllCotas, setCotas} from "../../store/slices/cotaSlice.js";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {Estatus, EstatusArchivos} from "../../utils/constantes.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {getAllUnidades, setUnidades} from "../../store/slices/unidadSlice.js";
import ProyectoService from "../../services/ProyectoService.js";
import {getAllArchivos} from "../../store/slices/archivoSlice.js";

const ArchivosTable = ({proyectoId, handleActionRow}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
   // const cotas = useSelector(state => state.cotas.cotas);
    const infoWebWorkerFiles =  useSelector(state => state.general.infoWebWorkerFiles);
    const archivos = useSelector(state => state.archivos.archivos);

    useEffect(() => {
        console.log("ArchivosTable unidadID: ", proyectoId);
        const cargarArchivos = ()=>{
            dispatch(setLoader(true));

            dispatch(getAllArchivos({proyectoId: proyectoId}))
                .then(resp => {
                    if(resp.payload.length > 0){
                        verDocumento(resp.payload[0]);
                    }
                    dispatch(setLoader(false));
                });

            /*
            ProyectoService.getDocumentosByProyectoId(proyectoId).then(response => {
                setArchivosProyecto(response.data);
                if(response.data.length > 0){
                    verDocumento(response.data[0]);
                }

                dispatch(setLoader(false));
            });
            */
        }
        if(proyectoId ) {
            cargarArchivos();
        }

        return () => {
            console.log("callback setArchivosProyecto: ", archivos);
            //setArchivosProyecto([]);
        };

    }, [proyectoId]);

    useEffect(() => {

        if(infoWebWorkerFiles != null){
            let isCargaActiva = infoWebWorkerFiles.proyectoId === proyectoId;
            let isCargaFinalizada = infoWebWorkerFiles.accion === EstatusArchivos.CARGA_ARCHIVOS_FIN;

            if(isCargaActiva && isCargaFinalizada){

                dispatch(getAllArchivos({proyectoId: proyectoId}))
                    .then(resp => {
                        if(resp.payload.length > 0){
                            verDocumento(resp.payload[0]);
                        }
                        dispatch(setLoader(false));
                    });
                /*
                ProyectoService.getDocumentosByProyectoId(proyectoId).then(response => {
                    setArchivosProyecto(response.data);
                    if(response.data.length > 0){
                        verDocumento(response.data[0]);
                    }
                });*/
            }
        }

    }, [infoWebWorkerFiles]);

    const columns = [
        {
            field: "id",
            headerName: "Id",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "proyectoId",
            headerName: "Proyecto Id",
            flex: 1,
        },
        {
            field: "nombre",
            headerName: "Archivo",
            flex: 1,
        },
        {
            field: "opciones",
            headerName: "Opciones",
            flex: 1,
            renderCell: ({ row }) => {
                return (
                    <ButtonGroup size="small" variant="contained"  aria-label="outlined button group">
                        <Button color="info" title="Ver" onClick={()=>{
                            verDocumento(row);
                        }}><RemoveRedEyeIcon/></Button>
                        <Button color="error" title="Eliminar" onClick={()=>{
                            alertaEliminar(row);
                        }}><DeleteForeverIcon/></Button>
                    </ButtonGroup>
                );
            },
        },
    ];

    const alertaEliminar = (documentoSelect) => {

        console.log("alertaEliminar", documentoSelect);
        withReactContent(Swal).fire({
            title: "¿Está seguro de eliminar?",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            denyButtonText: `Cancelar`
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("SE CONFIRMA ELIMINACIÓN")
                handleActionRow(documentoSelect, false);
            }
        });
    }

    const verDocumento = (documentoSelect) => {
        console.log("documentoSelect", documentoSelect)
        handleActionRow(documentoSelect, true);
    }

    return (
        <Box>
            {/*<Header subtitle="Cotas" />*/}
            <Box
                //m="40px 0 0 0"
                height="500px"
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
                <DataGrid rows={archivos} columns={columns} />
            </Box>
        </Box>
    );
};

export default ArchivosTable;
