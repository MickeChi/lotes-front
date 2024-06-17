import {
    Autocomplete,
    Box,
    Button, Card, CardActions, CardContent, Divider, Grid, LinearProgress, Modal, Stack,
    TextField,
    useTheme
} from "@mui/material";
import { v4 as randomUUID } from 'uuid';

import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useEffect, useState} from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CardHeader from "@mui/material/CardHeader";
import {ArchivosProps, Estatus, EstatusArchivos, IdbProps} from "../../utils/constantes.js";
import UnidadForm from "../unidad/UnidadForm.jsx";
import CotaTab from "../cotas/CotaTab.jsx";
import ArchivosTable from "./ArchivosTable.jsx";
import IdbxService from "../../services/IdbxService.js";
import {setInfoWebWorkerFiles, setLoader, setRunWebWorkerFiles} from "../../store/slices/generalSlice.js";
import {useDispatch, useSelector} from "react-redux";
import ProyectoService from "../../services/ProyectoService.js";
import PreviewFile from "./PreviewFile.jsx";
import {deleteArchivo} from "../../store/slices/archivoSlice.js";

const initialValues = {
    "documentos": []
}

const ArchivosProyectoModal = ({proyectoId, openModal, onCloseModal}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formState, setFormState] = useState(initialValues);
    const [esEditar, setEsEditar] = useState(false);
    const [urlDocumento, setUrlDocumento] = useState(null);
    const dispatch = useDispatch();
    const runWebWorkerFiles =  useSelector(state => state.general.runWebWorkerFiles);
    const infoWebWorkerFiles =  useSelector(state => state.general.infoWebWorkerFiles);
    const [cargaArchivosFinalizado, setCargaArchivosFinalizado] = useState(false);
    const [cargaArchivosActivo, setCargaArchivosActivo] = useState(false);
    const [documentoSelect, setDocumentoSelect] = useState(null);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        border: '1px solid #555',
        //maxHeight: 800, overflowY: 'auto',
        backgroundColor: `${colors.primary[400]}`,
        boxShadow: 24,
    };

    useEffect(() => {



    }, []);

    useEffect(() => {

        if(infoWebWorkerFiles != null){
            let isCargaActiva = infoWebWorkerFiles.proyectoId === proyectoId;
            let isCargaFinalizada = infoWebWorkerFiles.accion === EstatusArchivos.CARGA_ARCHIVOS_FIN;

            /*if(isCargaActiva && isCargaFinalizada){
                ProyectoService.getDocumentosByProyectoId(proyectoId).then(result => {
                    setArchivosProyecto(result);
                });
            }*/

            setCargaArchivosActivo(isCargaActiva);
            setCargaArchivosFinalizado(isCargaFinalizada);



        }

    }, [infoWebWorkerFiles]);




    useEffect(() => {
        console.log("useEffect UnidadModal: ", openModal);

        /*if(openModal){
            ProyectoService.getDocumentosByProyectoId(proyectoId).then(result => {
                setArchivosProyecto(result);
            });

            if(infoWebWorkerFiles != null){
                let isCargaActiva = infoWebWorkerFiles.proyectoId === proyectoId;
                setCargaArchivosActivo(isCargaActiva);
                setCargaArchivosFinalizado(infoWebWorkerFiles.accion === EstatusArchivos.CARGA_ARCHIVOS_FIN);
            }
        }*/

        return () => {
            console.log("callback UnidadModal: ", openModal);
            if(openModal){
                console.log("RESET UnidadModal: ", openModal);
                handleReset();
            }
        };
    }, [openModal]);

    useEffect(() => {
        if(proyectoId){
            setEsEditar(true);
            //setFormState(unidadExt);
        }
    }, [proyectoId]);

    const isValidTypePreview = (type) => ArchivosProps.FILE_TYPES_PREVIEW.includes(type);

    const handleActionRow = (documento, show = false) => {

        if(show){
            console.log("handlerActionsFile SHOW: ", documento, show);
            setUrlDocumento(documento && isValidTypePreview(documento.tipo) ? import.meta.env.VITE_APP_API_BASE + "/docfiles/" + documento.nombre : null);

        }else{
            console.log("handlerActionsFile ELIMINAR ", documento);
            setDocumentoSelect(documento);
            dispatch(deleteArchivo(documento)).then(resp => {
                if(resp.error){ //Error
                    withReactContent(Swal).fire({
                        title: "No es posible eliminar el archivo, esta en uso",
                        icon: "error"
                    })
                }else{
                    withReactContent(Swal).fire({
                        title: "Se eliminó el documento correctamente",
                        icon: "success"
                    })
                }
                dispatch(setLoader(false));
            });

        }
    }



    const handleFormSubmit = (values, actions) => {
        //const id = values.unidadId !== null ? values.unidadId : randomUUID();
        //const valuesRequest = {...values, unidadId: id};
        //console.log("esEditar: " + esEditar + ", UnidadExtRequest: ", valuesRequest);

        IdbxService.getIdbxInstance().then(idbx => {

            const idbStore = idbx.transaction(IdbProps.STORE_NAME, 'readwrite').objectStore(IdbProps.STORE_NAME);

            Array.from(values.documentos).forEach(file => {
                let objFile = {
                    fileName: file.name,
                    fileData: file,
                    size: file.size,
                    type: file.type,
                    proyectoId: proyectoId,
                    fileNameCode: `P${proyectoId}U${file.name}`
                }

                idbStore.add(objFile);
            });

            idbStore.transaction.oncomplete = () => {
                console.log("Se inicia procesamiento de archivos");
                actions.resetForm();
                setFormState(initialValues);
                let filesInfo = {
                    proyectoId
                };
                dispatch(setInfoWebWorkerFiles(filesInfo));
                dispatch(setRunWebWorkerFiles(true));
            };
        });



        /*actions.resetForm();
        onCloseModal(false);
        withReactContent(Swal).fire({
            title: "Se agregó correctamente",
            icon: "success"
        });*/
    };

    const handleReset = () => {
        console.log("Reset form initialValues: ", initialValues);
        setFormState(initialValues);
        setEsEditar(false);
        setUrlDocumento(null);
        onCloseModal(false);
    }

    const handleCloseModal= () => onCloseModal(false);

    const readFileArrayBuffer = (file) => {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();

            reader.onload = function (event) {
                resolve({
                    fileName: file.name,
                    fileData: event.target.result,
                    size: file.size,
                    type: file.type,
                    proyectoId: 1,
                    fileNameCode: 'P1U1'
                });
            };

            reader.onerror = function () {
                reject(reader);
            };

            reader.readAsArrayBuffer(file);
        });
    }

    const getFileFromInputV2 = (files) => {
        //let files = document.getElementById('file').files;
        let readers = [];

        // Abort if there were no files selected
        if (!files.length) return;

        // Store promises in array
        for (let i = 0; i < files.length; i++) {
            readers.push(readFileArrayBuffer(files[i]));
        }

        return Promise.all(readers);
    };

    return (
        <div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{zIndex: 100}}
            >
                <Box sx={style}>
                    <Card sx={{
                        backgroundColor: `${colors.primary[400]}`,
                        backgroundImage: `none`
                    }}>
                        <CardHeader sx={{
                            borderBottom: '1px solid #555'
                        }}
                                    title="Documentos"
                        />
                        <CardContent>
                            <Grid container spacing={3} sx={{maxHeight: 750, overflowY: 'auto',}}>
                                <Grid item md={4}>

                                    <Box mt="20px">
                                        <Box>

                                            <Formik

                                                onSubmit={handleFormSubmit}
                                                initialValues={formState}
                                                validationSchema={checkoutSchema}
                                                enableReinitialize
                                            >
                                                {({
                                                      values,
                                                      errors,
                                                      touched,
                                                      handleBlur,
                                                      handleChange,
                                                      handleSubmit,
                                                      setFieldValue
                                                  }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <Box
                                                            display="grid"
                                                            gap="30px"
                                                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                                            sx={{
                                                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                                            }}
                                                        >
                                                            <TextField
                                                                disabled={runWebWorkerFiles}
                                                                fullWidth
                                                                variant="filled"
                                                                type="file"
                                                                label="Seleccione documentos"
                                                                InputLabelProps={{ shrink: true }}
                                                                inputProps={{
                                                                    multiple: true
                                                                }}
                                                                onBlur={handleBlur}
                                                                name="documentos"
                                                                color="secondary"
                                                                error={!!touched.documentos && !!errors.documentos}
                                                                helperText={touched.documentos && errors.documentos}
                                                                sx={{ gridColumn: "span 4" }}
                                                                onChange={(e) => {
                                                                    setFieldValue("documentos", e.currentTarget.files);
                                                                    //console.log("documento: ", e.currentTarget.files[0]);
                                                                    //createFilePreview(e.currentTarget.files[0]);
                                                                }}
                                                            />
                                                        </Box>
                                                        {runWebWorkerFiles && <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                                                            <LinearProgress color="secondary" />
                                                        </Stack>}
                                                        <Box display="flex" justifyContent="end" mt="20px" cellSpacing={2}>
                                                            {runWebWorkerFiles &&
                                                                <Button color="warning" variant="contained" onClick={() => {
                                                                    return false;
                                                                }}>
                                                                    Cargando
                                                                </Button>
                                                            }&nbsp;&nbsp;
                                                            {!runWebWorkerFiles &&
                                                                <Button type="submit" color="secondary" variant="contained">
                                                                    Agregar
                                                                </Button>}
                                                        </Box>
                                                    </form>
                                                )}
                                            </Formik>

                                        </Box>
                                        <Box mt="20px">
                                            <ArchivosTable proyectoId={proyectoId} handleActionRow={handleActionRow}/>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item md={8}>
                                    <PreviewFile urlFile={urlDocumento} />
                                </Grid>

                            </Grid>
                        </CardContent>
                        <CardActions sx={{
                            alignSelf: "stretch",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "flex-start",
                            borderTop: '1px solid #555'
                        }}>
                            <Button color="warning" variant="contained" onClick={() => {
                                handleReset()
                            }}>
                                Cerrar
                            </Button>&nbsp;&nbsp;

                        </CardActions>
                    </Card>

                </Box>

            </Modal>
        </div>
    );
};

const checkoutSchema = yup.object().shape({
    /*documentos: yup.mixed()
        //.required("required")
        .nullable()
        .notRequired()
        .test("FILE_SIZE", "El tamaño del archivo es muy grande, maximo 15Mb",
            value => !value || (value && value.size <= 15000000))
        .test("FILE_FORMAT", "El tipo de archivo no es válido.",
            value => !value || (value && ["application/pdf", "image/jpeg"].includes(value.type)))*/
});


export default ArchivosProyectoModal;
