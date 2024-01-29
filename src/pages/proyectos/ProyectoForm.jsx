import {
    Autocomplete,
    Box,
    Button, FilledInput,
    FormControl,
    FormHelperText,
    Grid, Input,
    InputLabel,
    TextField,
    useTheme
} from "@mui/material";
import {Formik, isNaN} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {tokens} from "../../theme.jsx";
import {useState, useEffect, useRef} from "react";
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
import ProyectoColindanciaForm from "./FraccionExternaTable.jsx";
import FraccionExternaTable from "./FraccionExternaTable.jsx";
import {AddCircle} from "@mui/icons-material";
import FraccionExternaModal from "./FraccionExternaModal.jsx";

const initialValues = {
    titulo: "",
    estado: "",
    municipio: "",
    localidad: "",
    subtotal: "",
    totalFracciones: "",
    uso: "",
    clase: "",
    puntoPartida: "",
    documento: ""
};
const ProyectoForm = ({esEditar, proyecto, handleEditProy}) => {
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
    const [fraccionesExternas, setFraccionesExternas] = useState([]);
    const [fraccionesExternasError, setFraccionesExternasError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [fraccionExtUpdate, setFraccionExtUpdate] = useState(null);

    const regexpNums = /^\d*$/;
    const orientaciones = ["NORTE", "SUR", "ESTE", "OESTE", "NOROESTE", "NORESTE", "SUROESTE", "SURESTE"];
    const [puntoPartidaSelect, setPuntoPartidaSelect] = useState(null);

    const usos = ["HABITACIONAL", "COMERCIAL", "COMUN"];
    const [usoSeleccionado, setUsoSeleccionado] = useState(null);

    useEffect(() => {
        if(proyecto){
            setPuntoPartidaSelect(proyecto.puntoPartida);
            setUsoSeleccionado(proyecto.uso);
            setFraccionesExternas(proyecto.fraccionesExternas);
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

    useEffect(() => {
        console.log("fraccionesExternas change", fraccionesExternas);
        if(fraccionesExternas.length === 0){
            setFraccionesExternasError(true);
        }else{
            setFraccionesExternasError(false);
        }

    }, [fraccionesExternas]);


    const handleFormSubmit = (values) => {
        console.log("crear proyecto: ", values);
        if(fraccionesExternas.length === 0) return

        const fraccionesExt = fraccionesExternas.map(f =>{
            f.fraccionId = regexpNums.test(f.fraccionId) ? f.fraccionId : null;
            return f;
        });

        const valuesRequest = {...values, fraccionesExternas: fraccionesExt}
        console.log("esEditar: " + esEditar + ", fraccionRequest: ", valuesRequest);

        let actionSubmit = esEditar ? updateProyecto : createProyecto;

        dispatch(setLoader(true));
        dispatch(actionSubmit(valuesRequest)).then((resp) => {

            dispatch(setLoader(false));
            withReactContent(Swal).fire({
                title: "Se guardó correctamente",
                icon: "success"
            })
            if(esEditar){
                handleEditProy(resp.payload);
            }else{
                navigate("/proyectos");
            }
        });

    };

    const handleSubmitModal = (fracExt) => {
        console.log("handleSubmitModal", fracExt);
        let existeFext = fraccionesExternas.find(f => f.fraccionId === fracExt.fraccionId);
        let listaFraccionesExt = [];
        if(existeFext !== undefined){
            listaFraccionesExt = fraccionesExternas.map( f => {
                if(f.fraccionId === fracExt.fraccionId){
                    f = fracExt;
                }
                return f;
            });
            setFraccionesExternas(listaFraccionesExt)
        }else{
            setFraccionesExternas(prevState => [...prevState, fracExt]);
        }
    }

    const handlerEditFracExt = (fraccExtEdit) => {
        console.log("handlerEditFracExt: ", fraccExtEdit);
        setFraccionExtUpdate(fraccExtEdit);
        setOpenModal(true);
    }

    const textoErrorCotas = fraccionesExternasError ? 'Agregue al menos una colindancia' : 'Colindancias externas del proyecto';

    return (

        <Grid container spacing={3}>
            <Grid item md={6}>
                <Header subtitle={ esEditar ? "Editando Proyecto" : "Nuevo Proyecto"}/>
            </Grid>
            <Grid item md={6}>
                <Box display="flex" justifyContent="space-between">
                    <Header subtitle={textoErrorCotas} error={fraccionesExternasError}/>
                    <Box>
                        <Button
                            size="small"
                            color="warning"
                            variant="contained"
                            onClick={() => {
                                setOpenModal(true);
                            }}
                        >
                            <AddCircle sx={{ mr: "10px" }}/>
                            Agregar colindancia
                        </Button>
                    </Box>
                </Box>
            </Grid>
            <Grid item md={12}>

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
                                <Grid item md={6} style={{ paddingTop: "0" }}>
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
                                            {/*<FormControl variant="filled">
                                                <InputLabel htmlFor="component-filled">Name</InputLabel>
                                                <FilledInput id="component-filled" defaultValue="Composed TextField" />
                                            </FormControl>*/}
                                            {/*<input id="file" name="file" type="file" onChange={(event) => {
                                                //setfieldvalue("file", event.currenttarget.files[0]);
                                            }}/>*/}

                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="file"
                                                label="Seleccione un archivo"
                                                InputLabelProps={{ shrink: true }}
                                                onBlur={handleBlur}
                                                //onChange={handleChange}
                                                //value={values.documento}
                                                name="documento"
                                                color="secondary"
                                                error={!!touched.documento && !!errors.documento}
                                                helperText={touched.documento && errors.documento}
                                                sx={{ gridColumn: "span 2" }}
                                                onChange={(e) => {
                                                    setFieldValue("documento", e.currentTarget.files[0]);
                                                    console.log("documento: ", e.currentTarget.files[0]);
                                                    /*setPuntoPartidaSelect(value);*/
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item md={6} style={{ paddingTop: "0" }}>
                                    <Grid container>
                                        <Grid item md={12}>
                                            <FraccionExternaTable
                                                handleEditRow={handlerEditFracExt}
                                                fraccionesExternas={fraccionesExternas}
                                            />
                                        </Grid>
                                    </Grid>
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

            <FraccionExternaModal openModal={openModal}
                                  fraccionExt={fraccionExtUpdate}
                                  handleEditRow={setFraccionExtUpdate}
                                  handleSubmitModal={handleSubmitModal}
                                  onCloseModal={setOpenModal}
            />

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
    puntoPartida: yup.string().required("required"),
    documento: yup.mixed()
        //.required("required")
        .nullable()
        .notRequired()
        .test("FILE_SIZE", "El tamaño del archivo es muy grande, maximo 15Mb",
            value => !value || (value && value.size <= 15000000))
        .test("FILE_FORMAT", "El tipo de archivo no es válido.",
            value => !value || (value && ["application/pdf", "image/jpeg"].includes(value.type)))
    /*.test("is-file-too-big", "File exceeds 10MB", () => {
        let valid = true;
        const files = fileRef?.current?.files;
        console.log("yp files: ", files);
        if (files) {
            const fileArr = Array.from(files);
            fileArr.forEach((file) => {
                const size = file.size / 1024 / 1024;
                if (size > 10) {
                    valid = false;
                }
            });
        }
        return valid;
    })
    .test(
        "is-file-of-correct-type",
        "File is not of supported type",
        () => {
            let valid = true;
            const files = fileRef?.current?.files;
            if (files) {
                const fileArr = Array.from(files);
                fileArr.forEach((file) => {
                    const type = file.type.split("/")[1];
                    const validTypes = [
                        "pdf"
                    ];
                    if (!validTypes.includes(type)) {
                        valid = false;
                    }
                });
            }
            return valid;
        }
    )*/

});





export default ProyectoForm;
