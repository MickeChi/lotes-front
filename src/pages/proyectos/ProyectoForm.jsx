import {Autocomplete, Box, Button, TextField, useTheme} from "@mui/material";
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

    return (
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
                            value={estadoSeleccionado}
                            sx={{ gridColumn: "span 2" }}
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

                        <Autocomplete
                            id="municipio"
                            name="municipio"
                            options={municipios}
                            getOptionLabel={option => option}
                            value={municipioSeleccionado}
                            sx={{ gridColumn: "span 2" }}
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
                            color="secondary"
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
                            color="secondary"
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
