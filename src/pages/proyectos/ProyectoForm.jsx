import {Autocomplete, Box, Button, FormControl, FormHelperText, Grid, TextField, useTheme} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {tokens} from "../../theme.jsx";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createProyecto, updateProyecto} from "../../store/slices/proyectoSlice.js";
import {
    getAllNamesEstados,
    getAllNamesMunicipiosByEstado,
    setLoader,
    setMunicipios
} from "../../store/slices/generalSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ProyectoColindanciaForm from "./ProyectoCotaTable.jsx";
import ProyectoCotaTable from "./ProyectoCotaTable.jsx";

const initialValues = {
    titulo: "",
    estado: "",
    municipio: "",
    localidad: "",
    subtotal: "",
    totalFracciones: "",
    uso: "",
    clase: "",
    puntoPartida: ""
};
const ProyectoForm = ({esEditar, proyecto}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
    const [formState, setFormState] = useState( proyecto || initialValues);
    const dispatch = useDispatch();
    const estados = useSelector(state => state.general.estados);
    const municipios = useSelector(state => state.general.municipios);
    const [contCargaMunicipio, setContCargaMunicipio] = useState(1);
    const [cotasSelected, setCotasSelected] = useState([]);
    const [cotasSelectedError, setCotasSelectedError] = useState(false);


    const orientaciones = ["NORTE", "SUR", "ESTE", "OESTE", "NOROESTE", "NORESTE", "SUROESTE", "SURESTE"];
    const [puntoPartidaSelect, setPuntoPartidaSelect] = useState(null);

    const usos = ["HABITACIONAL", "COMERCIAL", "COMUN"];
    const [usoSeleccionado, setUsoSeleccionado] = useState(null);

    useEffect(() => {
        if(proyecto){
            setPuntoPartidaSelect(proyecto.puntoPartida);
            setUsoSeleccionado(proyecto.uso);
        }

    }, [proyecto]);

    useEffect(() => {
        if(estados.length === 0){
            dispatch(getAllNamesEstados())
        }else{
            if(esEditar){
                setEstadoSeleccionado(proyecto.estado);
            }
        }

    }, [estados]);

    useEffect(() => {
        const obtenerMunicipios = (nombreEstado) => {
            dispatch(getAllNamesMunicipiosByEstado(nombreEstado)).then(resp => {
                if(contCargaMunicipio === 1 && esEditar){
                    let municiopSel = resp.payload.find(e => e === proyecto.municipio);
                    setMunicipioSeleccionado(municiopSel === undefined ? null : municiopSel);
                }
                setContCargaMunicipio((contCargaMunicipio + 1 ));
            });
        };

        if (estadoSeleccionado !== null) {
            obtenerMunicipios(estadoSeleccionado);
        }else{
            dispatch(setMunicipios([]));
        }

    }, [estadoSeleccionado]);


    const handleFormSubmit = (values) => {
        console.log("crear proyecto: ", values);
        if(cotasSelected.length === 0){
            setCotasSelectedError(true);
            return;
        }

        dispatch(setLoader(true));
        let actionSubmit = esEditar ? updateProyecto : createProyecto;

        dispatch(actionSubmit(values)).then(() => {
            dispatch(setLoader(false));
            withReactContent(Swal).fire({
                title: "Se guardó correctamente",
                icon: "success"
            })
            if(!esEditar){
                navigate("/proyectos");
            }
        });

    };

    const cotasChangeHandler = (cotasTable) => {
        console.log("cotasChangeHandler: ", cotasTable)
        if(cotasTable.length > 0){
            setCotasSelectedError(false);
        }
        setCotasSelected(cotasTable);
    }

    return (

        <Grid container spacing={3}>
            <Grid item md={6}>
                <Header subtitle="Nuevo Proyecto"/>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={formState}
                    validationSchema={checkoutSchema}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          setFieldValue,
                          //handleReset
                      }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item md={12}>
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
                                        //sx={{ gridColumn: "span 4" }}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <Autocomplete
                                        id="estado"
                                        name="estado"
                                        options={estados}
                                        getOptionLabel={option => option}
                                        value={estadoSeleccionado}
                                        //sx={{ gridColumn: "span 2" }}
                                        onChange={(e, value) => {
                                            setFieldValue("municipio", "");
                                            setMunicipioSeleccionado(null);
                                            setFieldValue("estado",value !== null ? value : initialValues.estado);
                                            setEstadoSeleccionado(value);
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
                                </Grid>
                                <Grid item md={6}>
                                    <Autocomplete
                                        id="municipio"
                                        name="municipio"
                                        options={municipios}
                                        getOptionLabel={option => option}
                                        value={municipioSeleccionado}
                                        //sx={{ gridColumn: "span 2" }}
                                        onChange={(e, value) => {
                                            setFieldValue(
                                                "municipio",
                                                value !== null ? value : initialValues.municipio
                                            );
                                            setMunicipioSeleccionado(value);
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
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Localidad"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.localidad}
                                        name="localidad"
                                        color="secondary"
                                        error={!!touched.localidad && !!errors.localidad}
                                        helperText={touched.localidad && errors.localidad}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Subtotal"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.subtotal}
                                        name="subtotal"
                                        color="secondary"
                                        error={!!touched.subtotal && !!errors.subtotal}
                                        helperText={touched.subtotal && errors.subtotal}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Total fracciones"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.totalFracciones}
                                        name="totalFracciones"
                                        color="secondary"
                                        error={!!touched.totalFracciones && !!errors.totalFracciones}
                                        helperText={touched.totalFracciones && errors.totalFracciones}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <Autocomplete
                                        id="uso"
                                        name="uso"
                                        options={usos}
                                        getOptionLabel={option => option}
                                        value={usoSeleccionado}
                                        sx={{ gridColumn: "span 2" }}
                                        onChange={(e, value) => {
                                            setFieldValue(
                                                "uso", value !== null ? value : initialValues.uso
                                            );
                                            setUsoSeleccionado(value);
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                label="Seleccione uso"
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                name="uso"
                                                color="secondary"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                error={!!touched.uso && !!errors.uso}
                                                helperText={touched.uso && errors.uso}
                                                {...params}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={6}>
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
                                        sx={{ gridColumn: "span 1" }}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <Autocomplete
                                        id="puntoPartida"
                                        name="puntoPartida"
                                        options={orientaciones}
                                        getOptionLabel={option => option}
                                        value={puntoPartidaSelect}
                                        sx={{ gridColumn: "span 2" }}
                                        onChange={(e, value) => {
                                            setFieldValue(
                                                "puntoPartida", value !== null ? value : initialValues.puntoPartida
                                            );
                                            setPuntoPartidaSelect(value);
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                label="Seleccione el punto de partida"
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                name="puntoPartida"
                                                color="secondary"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                error={!!touched.puntoPartida && !!errors.puntoPartida}
                                                helperText={touched.puntoPartida && errors.puntoPartida}
                                                {...params}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    {cotasSelectedError && <FormControl error variant="standard">
                                        <FormHelperText id="tableCotasPRoyecto">Debe Seleccionar agregar al menos una cota al proyecto</FormHelperText>
                                    </FormControl>}
                                </Grid>
                                <Grid item md={12} display="flex" justifyContent="end">
                                    <Button type="submit" color="secondary" variant="contained">
                                        Guardar
                                    </Button>
                                </Grid>

                            </Grid>
                        </form>
                    )}
                </Formik>
            </Grid>
            <Grid item md={6}>
                <ProyectoCotaTable fraccionId={null}
                                   proyecto={proyecto}
                                   onChange={cotasChangeHandler}
                                   cotasSelected={[]}

                />
            </Grid>
        </Grid>


    );
};


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


export default ProyectoForm;
