import {Box, Paper, useTheme} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {tokens} from "../../theme.jsx";
import {useNavigate} from "react-router-dom";
import ProyectoForm from "./ProyectoForm.jsx";

const ProyectoCreatePage = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    return (
        <Box m="20px">

            <Header title="NUEVO PROYECTO" subtitle="Crear un nuevo proyecto" />

            <Paper sx={{
                backgroundColor: `${colors.primary[400]}`,
                my: { xs: 3, md: 3 }, p: { xs: 2, md: 3 }
            }}>
                <ProyectoForm esEditar={false} />

            </Paper>
        </Box>
    );
};


export default ProyectoCreatePage;
