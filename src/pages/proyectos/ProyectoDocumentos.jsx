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
import {Estatus, ValidacionesDoc} from "../../utils/constantes.js";
import {toDecimals} from "../../utils/Utils.js";


const ProyectoDocumentos = ({proyecto, proyectoTitulo}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const [tituloDoc, setTituloDoc] = useState("");
    const [docGenerado, setDocGenerado] = useState(null);
    const unidades = useSelector(state => state.unidades.unidades);
    const [cotas, setCotas] = useState([]);


    useEffect(() => {
        console.log("1.- validarUnidades - cant unidades: ", unidades.length);
        if(unidades.length > 0){
            console.log("1.1- validarUnidades - cant unidades: ", unidades.length);
            validarUnidades();
        }

    }, [unidades]);



    useEffect(() => {
        console.log("proyectoId: ", proyecto.id);
        console.log("2.- carga unidades - cant unidades: ", unidades.length);

        if(proyecto) {
            setTituloDoc("documentoProyecto_" + proyecto.id);
            dispatch(setLoader(true));
            dispatch(getAllUnidades({proyectoId: proyecto.id}))
                .then(resp => {
                    dispatch(setLoader(false));
                    console.log("2.1- after carga unidades - cant unidades: ", unidades.length);
                    let cotasAll = [];
                    resp.payload.forEach(u => {
                        if(u.cotas != null && u.cotas.length > 0) {
                            let cotasActivas = u.cotas.filter(c => c.estatus === Estatus.ACTIVO);
                            console.log("cotasActivas: ", cotasActivas);
                            cotasAll.push(...cotasActivas);
                        }
                    });
                    console.log("cotasAll: ", cotasAll);
                    setCotas(cotasAll);

                    //validarUnidades();
                });
        }

        return () => {
            console.log("callback setCotas: ", unidades);
            dispatch(setUnidades([]));
        };
    }, []);

    const isValidNumber = (num) => {
        let esVacio = num === null || num === "" || num === undefined;
        return (esVacio || isNaN(num)) ? 0 : toDecimals(num);
    }

    const validarUnidades = () => {

        console.log("validarUnidades -unidades: ", unidades);
        console.log("validarUnidades - proyecto: ", proyecto);
        console.log("validarUnidades - cotas: ", cotas);

        let tipoDesarrollo = ValidacionesDoc.tiposDesarrollo.find(tp => tp.id === proyecto.tipoDesarrollo.id);

        let validacionesSumas = {...tipoDesarrollo.validaciones}

        validacionesSumas.terrenoExclusivoTotal = unidades.reduce((sum, u) => {
            return sum + isValidNumber(u.terrenoExclusivo)
        }, 0);

        validacionesSumas.terrenoComunTotal = unidades.reduce((sum, u) => {
            return sum + isValidNumber(u.terrenoComun)
        }, 0);

        validacionesSumas.terrenoTotal = validacionesSumas.terrenoExclusivoTotal + validacionesSumas.terrenoComunTotal;

        validacionesSumas.construccionExclusivoTotal = unidades.reduce((sum, u) => {
            return sum + isValidNumber(u.construccionExclusiva)
        }, 0);

        validacionesSumas.construccionComunTotal = unidades.reduce((sum, u) => {
            return sum + isValidNumber(u.construccionComun)
        }, 0);

        validacionesSumas.construccionTotal = validacionesSumas.construccionExclusivoTotal + validacionesSumas.construccionComunTotal;

        if(validacionesSumas["cuotaPaInTotal"] !== undefined){
            validacionesSumas.cuotaPaInTotal = unidades.reduce((sum, u) => {
                return sum + isValidNumber(u.cuotaPaIn)
            }, 0);
        }


        validacionesSumas.totalUnidades = unidades.length;

        validacionesSumas.unidadesIncompletas = unidades.filter(u => {
            return (u.cotas.filter(c => c.estatus === Estatus.ACTIVO).length < 3)
        }).length;

        validacionesSumas.cotasIncompletas = (cotas.filter(c => c.colindanciaId === null)).length ;

        console.log("validacionesSumas: ", validacionesSumas);
        //console.log("proyecto: ", proyecto);


        return Object.entries(validacionesSumas).some(([key, value]) => {
            let error = false;
            let message = null;
            if(['unidadesIncompletas'].includes(key)){
                message = mensajeUnidadeIncompletas(key, value);
                error = (value > 0);
            }else if(['cotasIncompletas'].includes(key)){
                message = mensajeCotasIncompletas(key, value);
                error = (value > 0);
            }else if(['cuotaPaInTotal'].includes(key)){
                message = mensajeCuotaPain(key, value);
                error = (value !== 100);
            }else if(['totalUnidades'].includes(key)){
                message = mensajeTotalUnidades(key, value);
                error = (value !== proyecto[key]);
            }else{
                message = mensajeTerrenoContruccion(key, value);
                error = (value !== proyecto[key] && Math.abs((proyecto[key] - value)) > 1);
            }
            console.log(error, message);

            if(error){
                //console.log(error, message);
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
        unidadesIncompletas: 'Unidades Incompletas',
        cotasIncompletas: 'Cotas Incompletas'
    }

    const mensajeTerrenoContruccion = (key, value) => `Se le informa que el proyecto ${proyecto.titulo}  tiene un ${validacionesNombres[key]} de ${proyecto[key]} m2,
         sin embargo observamos que se han ingresado ${value} m2 entre todas las unidades. 
         Si necesita ayuda copie este mensaje y envielo por correo a contacto@aliadonotarial.com`;

    const mensajeTotalUnidades = (key, value) => `El proyecto ${proyecto.titulo} tiene un total de ${proyecto[key]} unidades sin embargo se han cargado ${value} `;

    const mensajeUnidadeIncompletas = (key, value) => `El proyecto ${proyecto.titulo} tiene un total de ${value} unidades con menos de 3 cotas`;

    const mensajeCotasIncompletas = (key, value) => `El proyecto ${proyecto.titulo} tiene un total de ${value} cota(s) sin colindancia`;

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
