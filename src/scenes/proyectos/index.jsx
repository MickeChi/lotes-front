import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme.jsx";
import Header from "../../components/Header";
import {CreateNewFolderOutlined} from "@mui/icons-material";
import ProyectoCard from "./ProyectoCard.jsx";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import ProyectoService from "../../services/ProyectoService.js";

const Proyectos = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        ProyectoService.getProyectos({})
            .then((response) => {
                if (response.data) {
                    setProyectos(response.data);
                }
            }).catch((error) => {
            console.log("Error: ", error);
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
