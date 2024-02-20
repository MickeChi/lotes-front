import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme.jsx";
import Header from "../../components/Header";
import {CreateNewFolderOutlined} from "@mui/icons-material";
import ProyectoCard from "./ProyectoCard.jsx";
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllProyectos} from "../../store/slices/proyectoSlice.js";
import {getAllNamesEstados, setLoader} from "../../store/slices/generalSlice.js";

const Proyectos = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const proyectos = useSelector(state => state.proyectos.proyectos);

    useEffect(() => {
        dispatch(setLoader(true));
        dispatch(getAllNamesEstados());
        dispatch(getAllProyectos()).then((resp) => {
            console.log("getAllProyectos - cargaGeneral: ", resp)
            dispatch(setLoader(false));
        });
    }, []);

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="PROYECTOS" subtitle="Administre sus proyectos aquí" />

                <Box>
                    <Link to="/proyectos/create">
                        <Button
                            sx={{
                                backgroundColor: colors.blueAccent[700],
                                color: colors.grey[100],
                                fontSize: "14px",
                                fontWeight: "bold",
                                padding: "10px 20px",
                            }}
                            variant="contained"
                        >
                            <CreateNewFolderOutlined sx={{ mr: "10px" }} />
                            Nuevo proyecto
                        </Button>
                    </Link>
                </Box>
            </Box>


            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap="20px"
            >
                {
                    proyectos.length > 0 && proyectos.map((p) => {
                        return (
                            <ProyectoCard key={p.id} proy={p}/>
                        )
                    })

                }

            </Box>

        </Box>
    );
};

export default Proyectos;
