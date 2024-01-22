import {Grid, useTheme} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useNavigate} from "react-router-dom";
import FraccionForm from "./FraccionForm.jsx";
import FraccionTable from "./FraccionTable.jsx";
import {useState} from "react";

const FraccionTab = ({proyectoId}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [fraccionUpdate, setFraccionUpdate] = useState(null);

    const handlerEditFraccion = (fraccionEdit) => {
        setFraccionUpdate(fraccionEdit);
    }

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
