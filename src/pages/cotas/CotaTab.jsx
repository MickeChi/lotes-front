import {Box, Grid, Paper, useTheme} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useNavigate} from "react-router-dom";
import CotaForm from "./CotaForm.jsx";
import CotaTable from "./CotaTable.jsx";
import {useEffect, useState} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {getAllUnidades, removeCotaUnidad} from "../../store/slices/unidadSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {Estatus} from "../../utils/constantes.js";
import {createCota, deleteCota, updateCota} from "../../store/slices/cotaSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const CotaTab = ({unidadId, showVertical}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [unidadIdSelect, setunidadIdSelect] = useState(null);
    const [cotaUpdate, setCotaUpdate] = useState(null);
    //const unidades = useSelector(state => state.unidades.unidades);


    /*useEffect(() => {
        if(unidades.length === 0){
            console.log("proyectoId: ", proyectoId);
            dispatch(setLoader(true));
            dispatch(getAllUnidades({proyectoId: proyectoId}))
                .then(resp => {
                    dispatch(setLoader(false));
                });
        }
    }, [unidades]);*/

    const handleUnidadSelect = (unidadSelect) => {
        console.log("handleUnidadSelect: ", unidadSelect);
        setunidadIdSelect(unidadSelect ? unidadSelect.id : null);
    }

    const handlerEditCota = (cotaEdit, eliminar = false) => {

        if(eliminar){
            console.log("handlerEditCota ELIMINAR: ", cotaEdit, eliminar);
            handleDelete(cotaEdit);
            //setCotaUpdate(null);
        }else{
            console.log("handlerEditCota: ", cotaEdit);
            setCotaUpdate(cotaEdit);

        }
    }

    const handleDelete = (cotaDelete) => {
        console.log("handleDelete: ", cotaDelete);

        dispatch(setLoader(true));
        dispatch(deleteCota(cotaDelete)).then((resp) => {
            dispatch(setLoader(false));
            dispatch(removeCotaUnidad(cotaDelete));
            setCotaUpdate(null);
            withReactContent(Swal).fire({
                title: "Se eliminó correctamente",
                icon: "success"
            })

        })
    };

    return (
        <Grid container spacing={3}>
            <Grid item md={showVertical ? 12 : 5}>
                <CotaForm handleUnidadSelect={handleUnidadSelect} cota={cotaUpdate} unidadId={unidadId} handleEditRow={handlerEditCota}/>
            </Grid>
            <Grid item md={showVertical ? 12: 7}>
                <CotaTable unidadId={unidadId} handleEditRow={handlerEditCota}/>
            </Grid>

            {/*<Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleClose} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>*/}
        </Grid>
    );
};


export default CotaTab;
