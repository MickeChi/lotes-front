import {
    Autocomplete,
    Box,
    Button, ButtonGroup, Card, CardActions, CardContent, Divider,
    Grid, Tab, Tabs,
    TextField,
    useTheme
} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useEffect, useState} from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {useDispatch} from "react-redux";
import {setLoader} from "../../store/slices/generalSlice.js";
import {createUnidad, updateUnidad} from "../../store/slices/unidadSlice.js";
import {ArchivosProps, Estatus} from "../../utils/constantes.js";
import CardHeader from "@mui/material/CardHeader";
import Modal from "@mui/material/Modal";
import UnidadForm from "./UnidadForm.jsx";
import CotaTab from "../cotas/CotaTab.jsx";
import PreviewFile from "../proyectos/PreviewFile.jsx";

const CotaFormModal = ({proyectoId, handleEditRow, unidad, openModal, onCloseModal}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const [esEditar, setEsEditar] = useState(false);
    const [urlDocumento, setUrlDocumento] = useState(null);
    const [unidadId, setUnidadId] = useState(null);
    const [currentTab, setCurrentTab] = useState(1);

    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

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
        console.log("useEffect UnidadModal: ", openModal)
        return () => {
            console.log("callback UnidadModal: ", openModal);
            if(openModal){
                console.log("RESET UnidadModal: ", openModal);
                handleReset();
            }
        };
    }, [openModal]);

    useEffect(() => {
        console.log("unidadForm: ", unidad);
        console.log("proyectoId: ", proyectoId);
        if(unidad){
            setUnidadId(unidad.id);
            let nombreDocumento = unidad.archivo ? import.meta.env.VITE_APP_API_BASE + "/docfiles/" + unidad.archivo.nombre : null ;
            setUrlDocumento(nombreDocumento);
        }else{
            setUrlDocumento(null);
            setUnidadId(null);
        }

    }, [proyectoId]);

    useEffect(() => {
        console.log("unidadId effect: ", unidadId);
    }, [unidadId]);

    const handleReset = () => {
        setEsEditar(false);
        handleEditRow(null);
        onCloseModal(false);
        setUrlDocumento(null);
        setCurrentTab(1);
    }

    const handleEditUnidad = (unidadEdit) => {
        if(unidadEdit != null){
            setUnidadId(unidadEdit.id);
            setCurrentTab(2);
        }
        handleEditRow(unidadEdit);
    }

    const isValidTypePreview = (type) => ArchivosProps.FILE_TYPES_PREVIEW.includes(type);

    const createFilePreview = (file) => {
        setUrlDocumento(null);
        console.log("createFilePreview SHOW: ", file);
        setUrlDocumento(file && isValidTypePreview(file.tipo) ? import.meta.env.VITE_APP_API_BASE + "/docfiles/" + file.nombre : null);
    }

    return (
        <div>
            <Modal
                open={openModal}
                onClose={(e, r)=> {
                    console.log("unidadModal onClose: ", e, r);
                    return false;
                    //onCloseModal(false);
                }}
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
                                    title="Cotas incompletas"
                        />
                        <CardContent>
                            <Grid container spacing={3} sx={{maxHeight: 750, overflowY: 'auto',}}>
                                <Grid item md={4}>

                                    <Tabs
                                        value={currentTab}
                                        onChange={handleChangeTab}
                                        textColor="primary"
                                        indicatorColor="default"
                                        sx={{
                                            backgroundColor: colors.blueAccent[700],
                                            ".Mui-selected": {
                                                color: `#e0e0e0 !important`,
                                                fontWeight: `bold`
                                            },
                                        }}
                                    >
                                        <Tab value={1} label="Editar Cota" />

                                    </Tabs>


                                    <Divider />
                                    <Box mt="20px">
                                        <CotaTab unidadId={unidadId}
                                                 proyectoId={proyectoId}
                                                 showVertical={true}
                                                 handleFilePreview={createFilePreview}
                                        />
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


export default CotaFormModal;
