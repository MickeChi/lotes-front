import {
    Box, Button,
    ButtonGroup,
    Grid, Paper,
    Typography,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme.jsx";
import Header from "../../components/Header.jsx";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import ProyectoService from "../../services/ProyectoService.js";
import {setLoader} from "../../store/slices/generalSlice.js";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';


const ProyectoDocumentos = ({proyectoId, proyectoTitulo}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const [tituloDoc, setTituloDoc] = useState("");
    const [docGenerado, setDocGenerado] = useState(null);

    useEffect(() => {
        if(proyectoId){

            setTituloDoc("documentoProyecto_" + proyectoId);
        }

    }, []);


    const generaDocumento = () => {
        console.log("Generando proyecto: ", proyectoId);
        dispatch(setLoader(true));
        ProyectoService.getFraccionesDoc(proyectoId).then(resp => {
            dispatch(setLoader(false));

            console.log("docGenerado: ", resp.data);
            setDocGenerado(resp.data);
        });
    }

    const descargaWord = (element, filename = '') => {
        let preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        let postHtml = "</body></html>";
        let html = preHtml+document.getElementById(element).innerHTML+postHtml;

        let blob = new Blob(['ufeff', html], {
            type: 'application/msword'
        });

        let url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        filename = filename?filename+'.doc':'document.doc';
        let downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);

        if(navigator.msSaveOrOpenBlob ){
            navigator.msSaveOrOpenBlob(blob, filename);
        }else{
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.click();
        }
        document.body.removeChild(downloadLink);
    }

    return (
        <Grid container>
            <Grid item md={12}>
                <Box m="20px">
                    <Header subtitle="Documento de proyecto"/>
                    <ButtonGroup variant="contained" aria-label="outlined secondary button group">
                        <Button
                            sx={{
                                backgroundColor: colors.blueAccent[700],
                                color: colors.grey[100]
                            }}
                            onClick={()=>{generaDocumento()}}
                            color="secondary"><SettingsSuggestIcon/> Generar
                        </Button>
                        {docGenerado && <Button
                            onClick={()=>{descargaWord('exportContent', tituloDoc)}} color="warning"><SimCardDownloadIcon/> Descargar</Button>}
                        {/* <Button color="secondary">Proyecto <FolderSpecialIcon/></Button>
                        <Button color="secondary">Otros <FileCopyIcon/></Button>*/}
                    </ButtonGroup>

                    {docGenerado && <Paper id="exportContent" sx={{
                        backgroundColor: `#fff`,
                        color: `#000`,
                        my: { xs: 3, md: 3 }, p: { xs: 2, md: 3 }
                    }}>
                        <Typography variant="h4" fontWeight="600" sx={{mt: "15px"}}>{proyectoTitulo}</Typography>

                        {
                            docGenerado.fraccionesTxt.map( f => {
                                return (
                                    <Typography key={f.fraccionId} variant="h6" fontWeight="600" sx={{mt: "15px"}}>{f.fraccionTexto}</Typography>
                                );
                            })
                        }

                    </Paper>
                    }

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
