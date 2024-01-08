import {Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, TextField, useTheme} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {tokens} from "../../theme.jsx";
import ProyectoService from "../../services/ProyectoService.js";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import EstadoService from "../../services/EstadoService.js";
import MunicipiosService from "../../services/MunicipiosService.js";

const FraccionForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [openLoader, setOpenLoader] = useState(false);
    const [estados, setEstados] = useState([]);
    const [estadosSeleccionado, setEstadosSeleccionado] = useState(null);
    const [municipios, setMunicipios] = useState([]);
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState("");

    useEffect(() => {
        const obtenerEstados = () => {
            EstadoService.getNombreEstados().then((response) => {
                setEstados(response);
            });
        };
        obtenerEstados();
    }, []);

    useEffect(() => {
        const obtenerMunicipios = (nombreEstado) => {
            MunicipiosService.getNombreMunicipiosByEstadoNombre(nombreEstado).then((response) => {
                setMunicipios(response);
            });
        };

        if (estadosSeleccionado !== null) {
            obtenerMunicipios(estadosSeleccionado);
        }else{
            setMunicipios([])
        }

    }, [estadosSeleccionado]);

    const handleFormSubmit = (values) => {
        console.log("crear proyecto: ", values);
        setOpenLoader(true);
        ProyectoService.addProyecto(values)
            .then((response) => {
                if (response.data) {
                    console.log("Se creó el proyecto: ", response.data);
                }
                setOpenLoader(false);
                navigate("/proyectos");
            })
            .catch((error) => {
                console.log("Error: ", error);
                setOpenLoader(false);
            });

    };

    return (
        <Box m="20px">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Header subtitle="Nueva Fracción"/>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      setFieldValue
                  }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Fracción"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.fraccion}
                                name="fraccion"
                                error={!!touched.fraccion && !!errors.fraccion}
                                helperText={touched.fraccion && errors.fraccion}
                                color="secondary"
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Número Catastral"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.numeroCatastral}
                                name="numeroCatastral"
                                error={!!touched.numeroCatastral && !!errors.numeroCatastral}
                                helperText={touched.numeroCatastral && errors.numeroCatastral}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Finca"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.finca}
                                name="finca"
                                error={!!touched.finca && !!errors.finca}
                                helperText={touched.finca && errors.finca}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Tablaje"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.tablaje}
                                name="tablaje"
                                error={!!touched.tablaje && !!errors.tablaje}
                                helperText={touched.tablaje && errors.tablaje}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Colonia"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.colonia}
                                name="colonia"
                                error={!!touched.colonia && !!errors.colonia}
                                helperText={touched.colonia && errors.colonia}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Folio Electrónico"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.folioElectronico}
                                name="folioElectronico"
                                error={!!touched.folioElectronico && !!errors.folioElectronico}
                                helperText={touched.folioElectronico && errors.folioElectronico}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Superficie de Terreno"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.superficieTerreno}
                                name="superficieTerreno"
                                error={!!touched.superficieTerreno && !!errors.superficieTerreno}
                                helperText={touched.superficieTerreno && errors.superficieTerreno}
                                sx={{ gridColumn: "span 2" }}
                            />



                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Guardar
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    //id:yup.string().required("required"),
    fraccion: yup.number().required("required"),
    numeroCatastral: yup.number().required("required"),
    finca: yup.string().required("required"),
    tablaje: yup.string().required("required"),
    colonia: yup.string().required("required"),
    folioElectronico: yup.string().required("required"),
    superficieTerreno: yup.number().required("required"),
    superficieConstruccion: yup.number().required("required"),
    valorCatastral: yup.number().required("required"),
    uso: yup.string().required("required"),
    clase: yup.string().required("required"),
    proyectoId: yup.number().required("required"),
    //cotas: yup.string().required("required"),
    tipoColindancia: yup.string().required("required"),
    colindanciaProyecto: yup.bool().required("required"),
    numeroParcela: yup.number().required("required"),
    descripcion: yup.string().required("required")

});
const initialValues = {
    "id":"",
    "fraccion":"",
    "numeroCatastral":"",
    "finca":"",
    "tablaje":"",
    "colonia":"",
    "folioElectronico":"",
    "superficieTerreno":"",
    "superficieConstruccion":"",
    "valorCatastral":"",
    "uso":"",
    "clase":"",
    "proyecto":"",
    "proyectoId":"",
    "cotas":"",
    "tipoColindancia":"",
    "colindanciaProyecto":"",
    "numeroParcela":"",
    "descripcion":""
};

export default FraccionForm;
