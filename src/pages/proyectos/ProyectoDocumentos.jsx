import {
    Autocomplete,
    Backdrop,
    Box, Button,
    ButtonGroup,
    CircularProgress,
    Grid, Paper,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme.jsx";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header.jsx";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import CotaForm from "../cotas/CotaForm.jsx";
import CotaTable from "../cotas/CotaTable.jsx";
import {useState} from "react";
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {useDispatch} from "react-redux";
import ProyectoService from "../../services/ProyectoService.js";
import {setLoader} from "../../store/slices/generalSlice.js";


const ProyectoDocumentos = ({proyectoId}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const [showText, setShowText] = useState(false);
    const [docGenerado, setDocGenerado] = useState(null);

    const generaDocumento = () => {
        console.log("Generando proyecto: ", proyectoId);
        dispatch(setLoader(true));
        ProyectoService.getFraccionesDoc(proyectoId).then(resp => {
            dispatch(setLoader(false));

            console.log("docGenerado: ", resp.data);
            setDocGenerado(resp.data);
            setShowText(true);
        });
    }

    return (
        <Grid container>
            <Grid item md={12}>
                <Box m="20px">
                    <Header subtitle="Genera Documentos"/>
                    <ButtonGroup variant="contained" aria-label="outlined secondary button group">
                        <Button onClick={()=>{generaDocumento()}} color="secondary">Proyecto <UploadFileIcon/></Button>
                       {/* <Button color="secondary">Proyecto <FolderSpecialIcon/></Button>
                        <Button color="secondary">Otros <FileCopyIcon/></Button>*/}
                    </ButtonGroup>

                    <Paper sx={{
                        backgroundColor: `${colors.primary[400]}`,
                        my: { xs: 3, md: 3 }, p: { xs: 2, md: 3 }
                    }}>
                        {/*{showText && <Typography variant="h6" fontWeight="600" sx={{mt: "15px"}}>{docGenerado.fraccionesGeneradas}</Typography>}*/}

                        {
                            docGenerado && docGenerado.fraccionesTxt.map( f => {
                                return (
                                    <Typography key={f.fraccionId} variant="h6" fontWeight="600" sx={{mt: "15px"}}>{f.fraccionTexto}</Typography>
                                );
                            })
                        }

                    </Paper>

                </Box>

            </Grid>
            <Grid item md={6}>
            </Grid>
            <Grid item md={6}>
            </Grid>
        </Grid>

    );
};

export default ProyectoDocumentos;
