import {Grid, useTheme} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useNavigate} from "react-router-dom";
import FraccionForm from "./FraccionForm.jsx";
import FraccionTable from "./FraccionTable.jsx";
import {useState} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {deleteCota} from "../../store/slices/cotaSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {useDispatch} from "react-redux";
import {deleteFraccion} from "../../store/slices/fraccionSlice.js";

const FraccionTab = ({proyectoId}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [fraccionUpdate, setFraccionUpdate] = useState(null);
    const dispatch = useDispatch();


    const handlerEditFraccion = (fraccionEdit, eliminar = false) => {

        if(eliminar){
            console.log("handlerEditFraccion ELIMINAR: ", fraccionEdit, eliminar);
            handleDelete(fraccionEdit);
        }else{
            console.log("handlerEditFraccion: ", fraccionEdit);
            setFraccionUpdate(fraccionEdit);

        }


    }

    const handleDelete = (fraccionDelete) => {
        console.log("handleDelete: ", fraccionDelete);

        dispatch(setLoader(true));
        dispatch(deleteFraccion(fraccionDelete)).then((resp) => {
            dispatch(setLoader(false));
            setFraccionUpdate(null);
            withReactContent(Swal).fire({
                title: "Se eliminó correctamente",
                icon: "success"
            })

        })
    };

    return (
        <Grid container spacing={3}>
            <Grid item md={4}>
                <FraccionForm proyectoId={proyectoId} fraccion={fraccionUpdate} handleEditRow={handlerEditFraccion}/>
            </Grid>
            <Grid item md={8}>
                <FraccionTable proyectoId={proyectoId} handleEditRow={handlerEditFraccion}/>
            </Grid>
        </Grid>
    );
};


export default FraccionTab;
