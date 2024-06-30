import {Box, Button, Chip, Grid, useTheme} from "@mui/material";
import {AddCircle, CheckCircle, Done} from "@mui/icons-material";

import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useNavigate} from "react-router-dom";
import UnidadForm from "./UnidadForm.jsx";
import UnidadTable from "./UnidadTable.jsx";
import {useEffect, useState} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {deleteCota, getCotasSinColindancia} from "../../store/slices/cotaSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {useDispatch, useSelector} from "react-redux";
import {deleteUnidad, removeCotaUnidad} from "../../store/slices/unidadSlice.js";
import Header from "../../components/Header.jsx";
import UnidadFormModal from "./UnidadFormModal.jsx";
import Avatar from "@mui/material/Avatar";
import {Estatus} from "../../utils/constantes.js";
import ButtonChip from "../../components/ButtonChip.jsx";
import CotaFormModal from "./CotaFormModal.jsx";

const UnidadTab = ({proyecto}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [unidadUpdate, setUnidadUpdate] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModalCota, setOpenModalCota] = useState(false);

    const dispatch = useDispatch();
    const unidades = useSelector(state => state.unidades.unidades);
    const cotasSinColindancia = useSelector(state => state.cotas.cotasSinColindancia);
    const cotas = useSelector(state => state.cotas.cotas);
    const [isCantUnidadesValidas, setIsCantUnidadesValidas] = useState(true);
    const [unidadesIncompletas, setUnidadesIncompletas] = useState(null);
    const [cotasIncompletas, setCotasIncompletas] = useState(null);
    const [cantUnidadesFaltantes, setCantUnidadesFaltantes] = useState(null);




    useEffect(() => {
        setIsCantUnidadesValidas(unidades.length < proyecto.totalUnidades );

        let uniIncompletas = unidades.filter(u => {
            return (u.cotas.filter(c => c.estatus === Estatus.ACTIVO).length < 3)
        }).length;

        setCantUnidadesFaltantes(proyecto.totalUnidades - unidades.length);
        setUnidadesIncompletas(uniIncompletas);
    }, [unidades]);

    useEffect(() => {

        dispatch(setLoader(true));
        dispatch(getCotasSinColindancia({proyectoId: proyecto.id})).then((resp) =>{
            dispatch(setLoader(false));
            console.log("cotasIncompletas payload: ", resp.payload);
        });

        /*return () => {
            console.log("callback chip: ", openModal);
            setCantUnidadesFaltantes(null);
            setUnidadesIncompletas(null);
            setCotasIncompletas(null);
        };*/

    }, [cotas, unidades]);

    useEffect(() => {
        console.log("cotasIncompletas: ", cotasSinColindancia);
        setCotasIncompletas(cotasSinColindancia.length);
    }, [cotasSinColindancia]);


    const handlerEditunidad = (unidadEdit, eliminar = false) => {

        if(eliminar){
            console.log("handlerEditunidad ELIMINAR: ", unidadEdit, eliminar);
            handleDelete(unidadEdit);
        }else{
            console.log("handlerEditunidad: ", unidadEdit);
            setUnidadUpdate(unidadEdit);
            setOpenModal(true);
        }
    }

    const handlerEditCota = (cotaEdit, eliminar = false) => {

        if(eliminar){
            console.log("handlerEditCota ELIMINAR: ", cotaEdit, eliminar);
        }else{
            console.log("handlerEditCota: ", cotaEdit);
        }
    }

    const handleDelete = (unidadDelete) => {
        console.log("handleDelete: ", unidadDelete);

        dispatch(setLoader(true));
        dispatch(deleteUnidad(unidadDelete)).then((resp) => {
            dispatch(setLoader(false));
            setUnidadUpdate(null);
            //Quitamos la cota de las unidad para actualziar tabla unidades
            withReactContent(Swal).fire({
                title: "Se eliminó correctamente",
                icon: "success"
            })

        })
    };

    const showErrorUnidadesInc = () => unidadesIncompletas != null && unidadesIncompletas > 0;
    const showErrorCotasInc = () => cotasIncompletas > 0 /*|| showErrorUnidadesInc()*/;

    const handlerBtnChip = () => {
        setOpenModalCota(true);
    }


    return (
        <Grid container spacing={3}>
            <Grid item md={12}>
                <Box display="flex" justifyContent="space-between">
                    <Header subtitle="Unidades" />
                    <Box >

                        {unidades.length > 0 && <ButtonChip info={unidadesIncompletas}
                                     labelError={"Unidades incompletas"}
                                     labelSuccess={"Unidades completas"}
                                     showError={showErrorUnidadesInc()}
                        />}

                        {unidades.length > 0 &&  <ButtonChip info={cotasIncompletas}
                                     labelError={"Cotas incompletas"}
                                     labelSuccess={"Cotas completas"}
                                     showError={showErrorCotasInc()}
                                     handlerBtnChip={handlerBtnChip}

                        />}

                        {unidades.length > 0 && <ButtonChip info={ cantUnidadesFaltantes }
                                    labelError={"Unidades faltantes"}
                                    labelSuccess={"Cantidad unidades"}
                                    showError={isCantUnidadesValidas}/>}


                        {isCantUnidadesValidas && <Button
                            size="small"
                            color="warning"
                            variant="contained"
                            onClick={() => {
                                setOpenModal(true);
                            }}
                        >
                            <AddCircle sx={{mr: "10px"}}/>
                            Agregar unidad
                        </Button>}



                        {/*<Header subtitle="Se ha completado el número de unidades" error="true"/>*/}
                    </Box>
                </Box>
            </Grid>





            {/*<Grid item md={4}>
                <UnidadForm proyectoId={proyectoId} unidad={unidadUpdate} handleEditRow={handlerEditunidad}/>
            </Grid>*/}
            <Grid item md={12} sx={{ paddingTop: '0px !important' }}>
                <UnidadTable proyectoId={proyecto.id} handleEditRow={handlerEditunidad}/>
            </Grid>

            <UnidadFormModal openModal={openModal}
                             proyectoId={proyecto.id}
                             unidad={unidadUpdate}
                             handleEditRow={handlerEditunidad}
                             onCloseModal={setOpenModal}
            />
            <CotaFormModal openModal={openModalCota}
                             proyectoId={proyecto.id}
                             unidad={unidadUpdate}
                             handleEditRow={handlerEditCota}
                             onCloseModal={setOpenModalCota}
            />
        </Grid>
    );
};


export default UnidadTab;
