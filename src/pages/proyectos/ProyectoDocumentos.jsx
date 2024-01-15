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
    const texto = "I.-Solar rústico ubicado en la localidad y municipio de Tixpehual Yucatán, marcado como tablaje catastral número tres mil novecientos noventa y ocho, cuya superficie de terreno es de 182.78m2 (ciento ochenta y dos punto setenta y ocho metros cuadrados). Polígono de figura irregular que se describe a continuación: partiendo del vértice sureste con rumbo al noreste en línea en línea recta colindando con parcela noventa y seis, mide 19.22m (diecinueve punto veintidós metros), de este punto con rumbo al noroeste en línea en línea recta colindando con parcela ochenta y tres, mide 8.89m (ocho punto ochenta y nueve metros), de este punto con rumbo al suroeste en línea en línea recta colindando con tablaje catastral cinco mil doscientos cuarenta y dos resultante de la presente división, mide 23.00m (veintitrés metros), y para cerrar el polígono que se describe con rumbo al sureste en línea en línea recta colindando con tablaje catastral cinco mil trescientos (vialidad) resultante de la presente división, mide 9.56m (nueve punto cincuenta y seis metros)";
    const [showText, setShowText] = useState(false);

    const generaDocumento = () => {
        console.log("Generando proyecto: ", proyectoId);
        dispatch(setLoader(true));
        ProyectoService.getFraccionesDoc(proyectoId).then(resp => {
            dispatch(setLoader(false));
            setShowText(true);
        });
    }

    return (
        <Grid container>
            <Grid item md={12}>
                <Box m="20px">
                    <Header subtitle="Genera Documentos"/>
                    <ButtonGroup variant="contained" aria-label="outlined secondary button group">
                        <Button onClick={()=>{generaDocumento()}} color="secondary">Fracciones <UploadFileIcon/></Button>
                        <Button color="secondary">Proyecto <FolderSpecialIcon/></Button>
                        <Button color="secondary">Otros <FileCopyIcon/></Button>
                    </ButtonGroup>

                    <Paper sx={{
                        backgroundColor: `${colors.primary[400]}`,
                        my: { xs: 3, md: 3 }, p: { xs: 2, md: 3 }
                    }}>
                        {showText && <Typography variant="h6" fontWeight="600" sx={{mt: "15px"}}>
                            I.-Solar rústico ubicado en la localidad y municipio de Tixpehual Yucatán, marcado como
                            tablaje catastral número tres mil novecientos noventa y ocho, cuya superficie de terreno es
                            de 182.78m2 (ciento ochenta y dos punto setenta y ocho metros cuadrados). Polígono de figura
                            irregular que se describe a continuación: partiendo del vértice sureste con rumbo al noreste
                            en línea en línea recta colindando con parcela noventa y seis, mide 19.22m (diecinueve punto
                            veintidós metros), de este punto con rumbo al noroeste en línea en línea recta colindando
                            con parcela ochenta y tres, mide 8.89m (ocho punto ochenta y nueve metros), de este punto
                            con rumbo al suroeste en línea en línea recta colindando con tablaje catastral cinco mil
                            doscientos cuarenta y dos resultante de la presente división, mide 23.00m (veintitrés
                            metros), y para cerrar el polígono que se describe con rumbo al sureste en línea en línea
                            recta colindando con tablaje catastral cinco mil trescientos (vialidad) resultante de la
                            presente división, mide 9.56m (nueve punto cincuenta y seis metros)
                            <br/><br/>
                            II.-Solar rústico ubicado en la localidad y municipio de Tixpehual Yucatán, marcado como
                            tablaje catastral número cinco mil doscientos cuarenta y dos, cuya superficie de terreno es
                            de 397.00m2 (trescientos noventa y siete metros cuadrados). Polígono de figura irregular que
                            se describe a continuación: partiendo del vértice sureste con rumbo al noreste en línea en
                            línea recta colindando con tablaje catastral tres mil novecientos noventa y ocho resultante
                            de la presente división, mide 23.00m (veintitrés metros), de este punto con rumbo al
                            noroeste en línea en línea recta colindando con parcela ochenta y tres, mide 16.91m
                            (dieciséis punto noventa y un metros),¬ de este punto con rumbo al suroeste en línea en
                            línea curva colindando con tablaje catastral cinco mil trescientos (vialidad) resultante de
                            la presente división, mide 20.20m (veinte punto veinte metros), de este punto con rumbo al
                            suroeste en línea en línea curva colindando con tablaje catastral cinco mil trescientos
                            (vialidad) resultante de la presente división, mide 16.94m (dieciséis punto noventa y cuatro
                            metros), de este punto con rumbo al suroeste en línea en línea recta colindando con tablaje
                            catastral cinco mil trescientos (vialidad) resultante de la presente división, mide 11.69m
                            (once punto sesenta y nueve metros), de este punto con rumbo al sureste en línea en línea
                            recta colindando con tablaje catastral cinco mil trescientos (vialidad) resultante de la
                            presente división, mide 2.08m (dos punto cero ocho metros), y para cerrar el polígono que se
                            describe con rumbo al noreste en línea en línea recta colindando con tablaje catastral cinco
                            mil trescientos (vialidad) resultante de la presente división, mide 17.14m (diecisiete punto
                            catorce metros)
                            <br/><br/>
                            III.-Solar rústico ubicado en la localidad y municipio de Tixpehual Yucatán, marcado como
                            tablaje catastral número cinco mil doscientos cuarenta y tres, cuya superficie de terreno es
                            de 620.30m2 (seiscientos veinte punto treinta metros cuadrados). Polígono de figura
                            irregular que se describe a continuación: partiendo del vértice sureste con rumbo al noreste
                            en línea en línea recta colindando con tablaje catastral cinco mil trescientos (vialidad)
                            resultante de la presente división, mide 2.79m (dos punto setenta y nueve metros), de este
                            punto con rumbo al noreste en línea en línea curva colindando con tablaje catastral cinco
                            mil trescientos (vialidad) resultante de la presente división, mide 16.17m (dieciséis punto
                            diecisiete metros), de este punto con rumbo al noreste en línea en línea curva colindando
                            con tablaje catastral cinco mil trescientos (vialidad) resultante de la presente división,
                            mide 18.83m (dieciocho punto ochenta y tres metros), de este punto con rumbo al noroeste en
                            línea en línea recta colindando con parcela ochenta y tres, mide 37.14m (treinta y siete
                            punto catorce metros), de este punto con rumbo al suroeste en línea en línea recta
                            colindando con tablaje catastral cinco mil doscientos cuarenta y seis resultante de la
                            presente división, mide 16.36m (dieciséis punto treinta y seis metros), y para cerrar el
                            polígono que se describe con rumbo al sureste en línea en línea recta colindando con
                            tablajes cinco mil doscientos cuarenta y siete, cinco mil doscientos cuarenta y cinco y
                            cinco mil doscientos cuarenta y cuatro, mide 38.29m (treinta y ocho punto veintinueve
                            metros)

                        </Typography>}
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
