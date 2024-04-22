import {Box, Button, Grid, useTheme} from "@mui/material";
import {AddCircle} from "@mui/icons-material";

import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useNavigate} from "react-router-dom";
import UnidadForm from "./UnidadForm.jsx";
import UnidadTable from "./UnidadTable.jsx";
import {useState} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {deleteCota} from "../../store/slices/cotaSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {useDispatch} from "react-redux";
import {deleteUnidad} from "../../store/slices/unidadSlice.js";
import Header from "../../components/Header.jsx";
import UnidadFormModal from "./UnidadFormModal.jsx";

const UnidadTab = ({proyectoId}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [unidadUpdate, setUnidadUpdate] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();


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
                        <Button
                            size="small"
                            color="warning"
                            variant="contained"
                            onClick={() => {
                                setOpenModal(true);
                            }}
                        >
                            <AddCircle sx={{ mr: "10px" }}/>
                            Agregar colindancia
                        </Button>
                    </Box>
                </Box>
            </Grid>





            {/*<Grid item md={4}>
                <UnidadForm proyectoId={proyectoId} unidad={unidadUpdate} handleEditRow={handlerEditunidad}/>
            </Grid>*/}
            <Grid item md={12} sx={{ paddingTop: '0px !important' }}>
                <UnidadTable proyectoId={proyectoId} handleEditRow={handlerEditunidad}/>
            </Grid>

            <UnidadFormModal openModal={openModal}
                        proyectoId={proyectoId}
                        unidad={unidadUpdate}
                        handleEditRow={handlerEditunidad}
                        onCloseModal={setOpenModal}
            />
        </Grid>
    );
};


export default UnidadTab;
