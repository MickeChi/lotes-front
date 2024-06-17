import {Box, CircularProgress, IconButton, Tooltip, useTheme} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import { ColorModeContext, tokens } from "../../theme.jsx";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {useSelector} from "react-redux";
import {EstatusArchivos} from "../../utils/constantes.js";

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const runWebWorkerFiles =  useSelector(state => state.general.runWebWorkerFiles);
    const infoWebWorkerFiles =  useSelector(state => state.general.infoWebWorkerFiles);
    const [isCargaFinalizada, setIsCargaFinalizada] = useState(false);

    useEffect(() => {

        if(infoWebWorkerFiles != null){
            let isCargaFinalizada = infoWebWorkerFiles.accion === EstatusArchivos.CARGA_ARCHIVOS_FIN;
            setIsCargaFinalizada(isCargaFinalizada);
        }

    }, [infoWebWorkerFiles]);

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"
            >
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                {
                    runWebWorkerFiles && <Tooltip title="Cargando documentos">
                        <IconButton>
                            <CircularProgress color="error" size={20}/>
                        </IconButton>
                    </Tooltip>
                }
                <Tooltip title="Cargando documentos">
                    <IconButton>
                        <NotificationsOutlinedIcon color="action" />
                    </IconButton>
                </Tooltip>
                {
                    (!runWebWorkerFiles && isCargaFinalizada) &&
                    <Tooltip title="Finalizó la carga de documentos">
                        <IconButton onClick={()=>{ setIsCargaFinalizada(false)}}>
                            <CheckCircleOutlineIcon color="success" />
                        </IconButton>
                    </Tooltip>
                }

                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <PersonOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Topbar;
