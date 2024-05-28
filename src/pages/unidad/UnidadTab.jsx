import {Box, Button, Chip, Grid, useTheme} from "@mui/material";
import {AddCircle, CheckCircle, Done} from "@mui/icons-material";

import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useNavigate} from "react-router-dom";
import UnidadForm from "./UnidadForm.jsx";
import UnidadTable from "./UnidadTable.jsx";
import {useEffect, useState} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {deleteCota} from "../../store/slices/cotaSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {useDispatch, useSelector} from "react-redux";
import {deleteUnidad, removeCotaUnidad} from "../../store/slices/unidadSlice.js";
import Header from "../../components/Header.jsx";
import UnidadFormModal from "./UnidadFormModal.jsx";
import Avatar from "@mui/material/Avatar";

const UnidadTab = ({proyecto}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [unidadUpdate, setUnidadUpdate] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const unidades = useSelector(state => state.unidades.unidades);
    const [cantUnidadesValidas, setCantUnidadesValidas] = useState(true);


    useEffect(() => {
        setCantUnidadesValidas(unidades.length < proyecto.totalUnidades );
    }, [unidades]);


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

    return (
        <Grid container spacing={3}>
            <Grid item md={12}>
                <Box display="flex" justifyContent="space-between">
                    <Header subtitle="Unidades" />
                    <Box>
                        {cantUnidadesValidas && <Button
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

                        {!cantUnidadesValidas && <Chip
                            sx={{
                                '.MuiChip-deleteIcon': {
                                    color: "#fff",
                                }
                            }}
                            color="success" label="Unidades completas"
                            onClick={()=>{}}
                            onDelete={()=>{}}
                            deleteIcon={<CheckCircle />}
                        />}

                         {/*<Chip color="success" label="Unidades completas"
                               avatar={<Avatar sx={{
                                   backgroundColor: "#fff",
                                   color: `#000 !important`,
                                   fontWeight: `bold`
                               }}>{unidades.length}</Avatar>}/>*/}


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
        </Grid>
    );
};


export default UnidadTab;
