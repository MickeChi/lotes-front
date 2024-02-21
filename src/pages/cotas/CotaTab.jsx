import {Box, Grid, Paper, useTheme} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useNavigate} from "react-router-dom";
import CotaForm from "./CotaForm.jsx";
import CotaTable from "./CotaTable.jsx";
import {useEffect, useState} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {getAllFracciones} from "../../store/slices/fraccionSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {Estatus} from "../../utils/constantes.js";
import {createCota, deleteCota, updateCota} from "../../store/slices/cotaSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const CotaTab = ({proyectoId}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [fraccionIdSelect, setFraccionIdSelect] = useState(null);
    const [cotaUpdate, setCotaUpdate] = useState(null);
    const fracciones = useSelector(state => state.fracciones.fracciones);


    useEffect(() => {
        if(fracciones.length === 0){
            console.log("proyectoId: ", proyectoId);
            dispatch(setLoader(true));
            dispatch(getAllFracciones({proyectoId: proyectoId}))
                .then(resp => {
                    dispatch(setLoader(false));
                });
        }
    }, [fracciones]);

    const handleFraccionSelect = (fraccionSelect) => {
        console.log("handleFraccionSelect: ", fraccionSelect);
        setFraccionIdSelect(fraccionSelect ? fraccionSelect.id : null);
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
            setCotaUpdate(null);
            withReactContent(Swal).fire({
                title: "Se eliminó correctamente",
                icon: "success"
            })

        })
    };

    return (
        <Grid container spacing={3}>
            <Grid item md={5}>
                <CotaForm handleFraccionSelect={handleFraccionSelect} cota={cotaUpdate} handleEditRow={handlerEditCota}/>
            </Grid>
            <Grid item md={7}>
                <CotaTable fraccionId={fraccionIdSelect} handleEditRow={handlerEditCota}/>
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
