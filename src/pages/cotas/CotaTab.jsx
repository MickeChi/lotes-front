import {Box, Grid, Paper, useTheme} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useNavigate} from "react-router-dom";
import CotaForm from "./CotaForm.jsx";
import CotaTable from "./CotaTable.jsx";
import {useState} from "react";

const CotaTab = ({proyectoId}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [fraccionIdSelect, setFraccionIdSelect] = useState(null);
    const [cotaUpdate, setCotaUpdate] = useState(null);

    const handleFraccionSelect = (fraccionSelect) => {
        console.log("handleFraccionSelect: ", fraccionSelect);
        setFraccionIdSelect(fraccionSelect ? fraccionSelect.id : null);
    }

    const handlerEditCota = (cotaEdit) => {
        console.log("handlerEditCota: ", cotaEdit);
        setCotaUpdate(cotaEdit);
    }

    return (
        <Grid container spacing={3}>
            <Grid item md={5}>
                <CotaForm handleFraccionSelect={handleFraccionSelect} cota={cotaUpdate}/>
            </Grid>
            <Grid item md={7}>
                <CotaTable fraccionId={fraccionIdSelect} handleEditRow={handlerEditCota}/>
            </Grid>
        </Grid>
    );
};


export default CotaTab;
