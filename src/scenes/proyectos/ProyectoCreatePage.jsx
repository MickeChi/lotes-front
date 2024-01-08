import {Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, TextField, useTheme} from "@mui/material";
import {Field, Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {tokens} from "../../theme.jsx";
import ProyectoService from "../../services/ProyectoService.js";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import EstadoService from "../../services/EstadoService.js";
import MunicipiosService from "../../services/MunicipiosService.js";

const ProyectoCreatePage = () => {
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
            <Header title="NUEVO PROYECTO" subtitle="Crear un nuevo proyecto" />

            <Paper sx={{
                backgroundColor: `${colors.primary[400]}`,
                my: { xs: 3, md: 3 }, p: { xs: 2, md: 3 }
            }}>


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
                                    label="Título"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.titulo}
                                    name="titulo"
                                    error={!!touched.titulo && !!errors.titulo}
                                    helperText={touched.titulo && errors.titulo}
                                    color="secondary"
                                    sx={{ gridColumn: "span 4" }}
                                />

                                <Autocomplete
                                    id="estado"
                                    name="estado"
                                    options={estados}
                                    getOptionLabel={option => option}
                                    sx={{ gridColumn: "span 2" }}
                                    onChange={(e, value) => {
                                        setFieldValue(
                                            "estado",
                                            value !== null ? value : initialValues.estado
                                        );
                                        setEstadosSeleccionado(value);
                                        if(value === null){
                                            setFieldValue("municipio", initialValues.municipio);
                                            setMunicipioSeleccionado(initialValues.municipio);
                                        }
                                    }}
                                    renderInput={params => (
                                        <TextField
                                            label="Seleccion el estado"
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            name="estado"
                                            color="secondary"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={!!touched.estado && !!errors.estado}
                                            helperText={touched.estado && errors.estado}
                                            {...params}
                                        />
                                    )}
                                />

                                <Autocomplete
                                    id="municipio"
                                    name="municipio"
                                    options={municipios}
                                    getOptionLabel={option => option}
                                    inputValue={municipioSeleccionado}
                                    sx={{ gridColumn: "span 2" }}
                                    onChange={(e, value) => {
                                        setFieldValue(
                                            "municipio",
                                            value !== null ? value : initialValues.municipio
                                        );
                                        setMunicipioSeleccionado(value !== null ? value : initialValues.municipio);
                                    }}
                                    renderInput={params => (
                                        <TextField
                                            label="Seleccion el municipio"
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            name="municipio"
                                            color="secondary"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={!!touched.municipio && !!errors.municipio}
                                            helperText={touched.municipio && errors.municipio}
                                            {...params}
                                        />
                                    )}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Subtotal"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.subtotal}
                                    name="subtotal"
                                    error={!!touched.subtotal && !!errors.subtotal}
                                    helperText={touched.subtotal && errors.subtotal}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Total fracciones"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.totalFracciones}
                                    name="totalFracciones"
                                    error={!!touched.totalFracciones && !!errors.totalFracciones}
                                    helperText={touched.totalFracciones && errors.totalFracciones}
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
                                    error={!!touched.uso && !!errors.uso}
                                    helperText={touched.uso && errors.uso}
                                    sx={{ gridColumn: "span 1" }}
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
                                    error={!!touched.clase && !!errors.clase}
                                    helperText={touched.clase && errors.clase}
                                    sx={{ gridColumn: "span 1" }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Punto de partida"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.puntoPartida}
                                    name="puntoPartida"
                                    error={!!touched.puntoPartida && !!errors.puntoPartida}
                                    helperText={touched.puntoPartida && errors.puntoPartida}
                                    sx={{ gridColumn: "span 1" }}
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
            </Paper>
        </Box>
    );
};

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    titulo: yup.string().required("required"),
    estado: yup.string().required("required"),
    municipio: yup.string().required("required"),
    subtotal: yup.number().required("required"),
    totalFracciones: yup.number().required("required"),
    uso: yup.string().required("required"),
    clase: yup.string().required("required"),
    puntoPartida: yup.string().required("required")

});
const initialValues = {
    titulo: "",
    estado: "",
    municipio: "",
    subtotal: "",
    totalFracciones: "",
    uso: "",
    clase: "",
    puntoPartida: ""
};

export default ProyectoCreatePage;
