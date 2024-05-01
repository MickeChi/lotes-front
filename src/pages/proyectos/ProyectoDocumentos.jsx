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
import {useDispatch, useSelector} from "react-redux";
import ProyectoService from "../../services/ProyectoService.js";
import {setLoader} from "../../store/slices/generalSlice.js";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import {getAllUnidades, setUnidades} from "../../store/slices/unidadSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {setCotas} from "../../store/slices/cotaSlice.js";


const ProyectoDocumentos = ({proyecto, proyectoTitulo}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const [tituloDoc, setTituloDoc] = useState("");
    const [docGenerado, setDocGenerado] = useState(null);
    const unidades = useSelector(state => state.unidades.unidades);


    useEffect(() => {
        if(unidades){
            validarUnidades();
        }

    }, [unidades]);



    useEffect(() => {
        if(proyecto){
            setTituloDoc("documentoProyecto_" + proyecto.id);
        }

    }, []);

    useEffect(() => {
        console.log("proyectoId: ", proyecto.id);
        if(proyecto) {
            dispatch(setLoader(true));
            dispatch(getAllUnidades({proyectoId: proyecto.id}))
                .then(resp => {
                    dispatch(setLoader(false));
                });
        }

        return () => {
            console.log("callback setCotas: ", unidades);
            dispatch(setUnidades([]));
        };
    }, []);

    const validarUnidades = () => {
        let unidadSuma = {
            terrenoTotal: 0,
            terrenoExclusivoTotal: 0,
            terrenoComunTotal: 0,
            construccionTotal: 0,
            construccionExclusivoTotal: 0,
            construccionComunTotal: 0,
            cuotaPaInTotal: 0,
            totalUnidades: 0,
            unidadesIncompletas: 0
        }
        unidadSuma.terrenoExclusivoTotal = unidades.reduce((sum, u) => {
            return sum + Number(u.terrenoExclusivo)
        }, 0);

        unidadSuma.terrenoComunTotal = unidades.reduce((sum, u) => {
            return sum + Number(u.terrenoComun)
        }, 0);

        unidadSuma.terrenoTotal = unidadSuma.terrenoExclusivoTotal + unidadSuma.terrenoComunTotal;

        unidadSuma.construccionExclusivoTotal = unidades.reduce((sum, u) => {
            return sum + Number(u.construccionExclusiva)
        }, 0);

        unidadSuma.construccionComunTotal = unidades.reduce((sum, u) => {
            return sum + Number(u.construccionComun)
        }, 0);

        unidadSuma.construccionTotal = unidadSuma.construccionExclusivoTotal + unidadSuma.construccionComunTotal;

        unidadSuma.cuotaPaInTotal = unidades.reduce((sum, u) => {
            return sum + Number(u.cuotaPaIn)
        }, 0);

        unidadSuma.totalUnidades = unidades.length;

        unidadSuma.unidadesIncompletas = unidades.filter(u => u.cotas.length < 3).length;

        //console.log("unidadSuma: ", unidadSuma);
        //console.log("proyecto: ", proyecto);


        return Object.entries(unidadSuma).some(([key, value]) => {
            let error = false;
            let message = null;
            if(['unidadesIncompletas'].includes(key)){
                message = mensajeUnidadesCotas(key, value);
                error = (value > 0);
            }else if(['cuotaPaInTotal'].includes(key)){
                message = mensajeCuotaPain(key, value);
                error = (value !== 100);
            }else if(['totalUnidades'].includes(key)){
                message = mensajeTotalUnidades(key, value);
                error = (value !== proyecto[key]);
            }else{
                message = mensajeTerrenoContruccion(key, value);
                error = (value !== proyecto[key]);
            }

            console.log(error, message);
            if(error){
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: message,
                    icon: "warning"
                });
            }

            return error;

        });

    }

    const validacionesNombres = {
        terrenoTotal: 'Terreno Total',
        terrenoExclusivoTotal: 'Terreno Exclusivo Total',
        terrenoComunTotal: 'Terreno Común Total',
        construccionTotal: 'Construcción Total',
        construccionExclusivoTotal: 'construccion Exclusivo Total',
        construccionComunTotal: 'Construcción Común Total',
        cuotaPaInTotal: 'Cuota Participacion Indiviso',
        totalUnidades: 'Total Unidades',
        unidadesIncompletas: 'Unidades Incompletas'
    }

    const mensajeTerrenoContruccion = (key, value) => `Se le informa que el proyecto ${proyecto.titulo}  tiene un ${validacionesNombres[key]} de ${proyecto[key]} m2,
         sin embargo observamos que se han ingresado ${value} m2 entre todas las unidades. 
         Si necesita ayuda copie este mensaje y envielo por correo a contacto@aliadonotarial.com`;

    const mensajeTotalUnidades = (key, value) => `El proyecto ${proyecto.titulo} tiene un total de ${proyecto[key]} unidades sin embargo se han cargado ${value} `;

    const mensajeUnidadesCotas = (key, value) => `El proyecto ${proyecto.titulo} tiene un total de ${value} unidades con menos de 3 cotas`;


    const mensajeCuotaPain = (key, value) => `Se le informa que el proyecto ${proyecto.titulo} no alcanza el 100% de cuota de 
    participación (${value}). 
    Si necesita ayuda copie este mensaje y envielo por correo a contacto@aliadonotarial.com`;


    const generaDocumento = () => {
        if(!validarUnidades()){
            dispatch(setLoader(true));
            ProyectoService.getUnidadesDoc(proyecto.id).then(resp => {
                dispatch(setLoader(false));

                console.log("docGenerado: ", resp.data);
                setDocGenerado(resp.data);
            });
        }
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
                            docGenerado.unidadesTxt.map( f => {
                                return (
                                    <Typography key={f.unidadId} variant="h6" fontWeight="600" sx={{mt: "15px"}}>{f.unidadTexto}</Typography>
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
