import {
    Autocomplete,
    Backdrop,
    Box,
    Button,
    CircularProgress, FormControl,
    FormControlLabel, InputLabel,
    Paper, Select,
    TextField,
    useTheme
} from "@mui/material";
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
import Checkbox from "@mui/material/Checkbox";
import {CheckBox} from "@mui/icons-material";
import {MenuItem} from "react-pro-sidebar";

const FraccionForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [openLoader, setOpenLoader] = useState(false);
    const tiposColindancias = ["PARCELA", "VIALIDAD", "LOTE"];
    const [tipoColSeleccionado, setTipoColSeleccionado] = useState("");

    useEffect(() => {
        /*const obtenerEstados = () => {
            EstadoService.getNombreEstados().then((response) => {
                setEstados(response);
            });
        };
        obtenerEstados();*/
    }, []);

    useEffect(() => {


    }, []);

    const handleFormSubmit = (values) => {
        console.log("crear proyecto: ", values);
        /*setOpenLoader(true);
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

         */

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
                                color="secondary"
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
                                color="secondary"
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
                                color="secondary"
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
                                color="secondary"
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
                                color="secondary"
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
                                color="secondary"
                                error={!!touched.superficieTerreno && !!errors.superficieTerreno}
                                helperText={touched.superficieTerreno && errors.superficieTerreno}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Superficie de contrucción"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.superficieConstruccion}
                                name="superficieConstruccion"
                                color="secondary"
                                error={!!touched.superficieConstruccion && !!errors.superficieConstruccion}
                                helperText={touched.superficieConstruccion && errors.superficieConstruccion}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Valor catastral"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.valorCatastral}
                                name="valorCatastral"
                                color="secondary"
                                error={!!touched.valorCatastral && !!errors.valorCatastral}
                                helperText={touched.valorCatastral && errors.valorCatastral}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Uso"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.uso}
                                name="uso"
                                color="secondary"
                                error={!!touched.uso && !!errors.uso}
                                helperText={touched.uso && errors.uso}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Clase"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.clase}
                                name="clase"
                                color="secondary"
                                error={!!touched.clase && !!errors.clase}
                                helperText={touched.clase && errors.clase}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <Autocomplete
                                id="tipoColindancia"
                                name="tipoColindancia"
                                options={tiposColindancias}
                                getOptionLabel={option => option}
                                inputValue={tipoColSeleccionado}
                                sx={{ gridColumn: "span 2" }}
                                onChange={(e, value) => {
                                    setFieldValue(
                                        "tipoColindancia",
                                        value !== null ? value : initialValues.tipoColindancia
                                    );

                                    setTipoColSeleccionado(value !== null ? value : initialValues.tipoColindancia);

                                }}
                                renderInput={params => (
                                    <TextField
                                        label="Seleccione tipo de colindancia"
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="tipoColindancia"
                                        color="secondary"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.tipoColindancia && !!errors.tipoColindancia}
                                        helperText={touched.tipoColindancia && errors.tipoColindancia}
                                        {...params}
                                    />
                                )}
                            />


                            <FormControlLabel control={
                                <Checkbox color="secondary" checked={values.colindanciaProyecto} />
                            }
                                              name="colindanciaProyecto"
                                              onChange={handleChange}
                                              label="Colindancia proyecto"
                                              sx={{ gridColumn: "span 2" }}/>



                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Numero parcela"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.numeroParcela}
                                name="numeroParcela"
                                color="secondary"
                                error={!!touched.numeroParcela && !!errors.numeroParcela}
                                helperText={touched.numeroParcela && errors.numeroParcela}
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
    //proyectoId: yup.number().required("required"),
    //cotas: yup.string().required("required"),
    tipoColindancia: yup.string().required("required"),
    colindanciaProyecto: yup.bool().required("required"),
    numeroParcela: yup.number().required("required"),
    //descripcion: yup.string().required("required")

});
const initialValues = {
    //"id":"",
    fraccion:"",
    numeroCatastral:"",
    finca:"",
    tablaje:"",
    colonia:"",
    folioElectronico:"",
    superficieTerreno:"",
    superficieConstruccion:"",
    valorCatastral:"",
    uso:"",
    clase:"",
    //proyecto:"",
    //proyectoId:"",
    //cotas:"",
    tipoColindancia:"",
    colindanciaProyecto: false,
    numeroParcela:"",
    //descripcion:""
};

export default FraccionForm;
