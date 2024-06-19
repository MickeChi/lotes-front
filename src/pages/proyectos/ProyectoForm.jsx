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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {createProyecto, updateProyecto} from "../../store/slices/proyectoSlice.js";
import {
    getAllNamesEstados,
    getAllNamesMunicipiosByEstado,
    setLoader,
    setMunicipios
} from "../../store/slices/generalSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ProyectoColindanciaForm from "./UnidadExternaTable.jsx";
import UnidadExternaTable from "./UnidadExternaTable.jsx";
import {AddCircle} from "@mui/icons-material";
import UnidadExternaModal from "./UnidadExternaModal.jsx";
import {deleteUnidad} from "../../store/slices/UnidadSlice.js";
import {ArchivosProps, Estatus, usos} from "../../utils/constantes.js";
import {getTiposDesarrollos} from "../../store/slices/catalogoSlice.js";
import ArchivosProyectoModal from "./ArchivosProyectoModal.jsx";
import {addArchivo, getAllArchivos, setArchivos} from "../../store/slices/archivoSlice.js";
import PreviewFile from "./PreviewFile.jsx";

const initialValues = {
    titulo: "",
    estado: "",
    municipio: "",
    localidad: "",
    subtotal: 0,
    tipoDesarrollo: "",
    archivo: "",
    uso: "",
    clase: "",
    documento: "",
    estatus: Estatus.ACTIVO,

    totalUnidades: 0,

    terrenoTotal: 0,
    terrenoExclusivoTotal: 0,
    terrenoComunTotal: 0,

    construccionTotal: 0,
    construccionExclusivoTotal: 0,
    construccionComunTotal: 0

};
const ProyectoForm = ({esEditar, proyecto, handleEditProy}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
    const [formState, setFormState] = useState(initialValues);
    const dispatch = useDispatch();
    const estados = useSelector(state => state.general.estados);
    const municipios = useSelector(state => state.general.municipios);
    const tiposDesarrollos = useSelector(state => state.catalogos.tiposDesarrollos);
    const [tipoDesarrolloSeleccionado, setTipoDesarrolloSeleccionado] = useState(null);
    const archivos = useSelector(state => state.archivos.archivos);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);


    const [contCargaMunicipio, setContCargaMunicipio] = useState(1);
    const [unidadesExternas, setUnidadesExternas] = useState([]);
    const [unidadesExternasError, setUnidadesExternasError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [unidadExtUpdate, setUnidadExtUpdate] = useState(null);
    const [urlDocumento, setUrlDocumento] = useState(null);

    const regexpNums = /^\d*$/;
    //const [puntoPartidaSelect, setPuntoPartidaSelect] = useState(null);

    const [usoSeleccionado, setUsoSeleccionado] = useState(null);

    useEffect(() => {
        if(proyecto){

            const proyectoState = {...proyecto};
            for(const key in proyectoState){
                if(initialValues.hasOwnProperty(key) && (proyectoState[key] === null || proyectoState[key] === undefined)){
                    proyectoState[key] = initialValues[key];
                }
            }
            //setPuntoPartidaSelect(proyecto.puntoPartida);
            setUsoSeleccionado(proyecto.uso);
            let nombreDocumento = proyecto.archivo ? import.meta.env.VITE_APP_API_BASE + "/docfiles/" + proyecto.archivo.nombre : null ;
            setUrlDocumento(nombreDocumento);
            if(proyecto && proyecto.archivo){
                setArchivoSeleccionado(proyecto.archivo);
            }
            setFormState(proyectoState);

        }

    }, [proyecto]);

    const cargaArchivosProyecto = () => {
        if(esEditar){
            dispatch(getAllArchivos({proyectoId: proyecto.id})).then((resp) => {
                if(proyecto && proyecto.archivo){
                    let archivoSel = resp.payload.find(t => t.id === proyecto.archivo.id);
                    setArchivoSeleccionado(archivoSel);
                }
            });
        }
    }

    const cargaTiposDedesarrollo = () => {
        if(tiposDesarrollos.length === 0){
            dispatch(getTiposDesarrollos()).then((resp) => {
                if(esEditar){
                    let tipoDesSel = resp.payload.find(t => t.id === proyecto.tipoDesarrollo.id);
                    setTipoDesarrolloSeleccionado(tipoDesSel);
                }
            });
        }else{
            if(esEditar){
                let tipoDesSel = tiposDesarrollos.find(t => t.id === proyecto.tipoDesarrollo.id);
                setTipoDesarrolloSeleccionado(tipoDesSel);
            }
        }
    }

    useEffect(() => {
        cargaArchivosProyecto();
        cargaTiposDedesarrollo();

        return () => {
            dispatch(setArchivos([]));
        };
    }, []);


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

    /*useEffect(() => {
        console.log("unidadesExternas change", unidadesExternas);
        if(unidadesExternas.length === 0){
            setUnidadesExternasError(true);
        }else{
            setUnidadesExternasError(false);
        }

    }, [unidadesExternas]);*/


    const handleFormSubmit = (values) => {
        console.log("crear proyecto: ", values);

        /*if(unidadesExternas.length === 0) return

        const unidadesExt = unidadesExternas.map(f =>{
            f.unidadId = regexpNums.test(f.unidadId) ? f.unidadId : null;
            return f;
        }).filter(f => !(f.unidadId == null && f.estatus === Estatus.DESACTIVADO));*/

        const valuesRequest = {...values}
        console.log("esEditar: " + esEditar + ", UnidadRequest: ", valuesRequest);

        let actionSubmit = esEditar ? updateProyecto : createProyecto;

        dispatch(setLoader(true));
        dispatch(actionSubmit(valuesRequest)).then((resp) => {

            dispatch(setLoader(false));
            if(resp.payload && resp.payload.archivo){
                dispatch(addArchivo(resp.payload.archivo));
            }
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
        let existeFext = unidadesExternas.find(f => f.unidadId === fracExt.unidadId);
        let listaUnidadesExt = [];
        if(existeFext !== undefined){
            listaUnidadesExt = unidadesExternas.map( f => {
                if(f.unidadId === fracExt.unidadId){
                    f = fracExt;
                }
                return f;
            });
            setUnidadesExternas(listaUnidadesExt)
        }else{
            setUnidadesExternas(prevState => [...prevState, fracExt]);
        }
    }

    const handlerEditFracExt = (unidExtEdit, eliminar = false) => {

        if(eliminar){
            console.log("handlerEditFracExt DELETE: ", unidExtEdit);
            handleDelete(unidExtEdit);
        }else{
            console.log("handlerEditFracExt: ", unidExtEdit);
            setUnidadExtUpdate(unidExtEdit);
            setOpenModal(true);

        }

    }


    const handleDelete = (unidadDelete) => {
        let unidExtDel = {...unidadDelete, estatus: Estatus.DESACTIVADO}
        console.log("handleDelete: ", unidExtDel);

        let existeFext = unidadesExternas.find(f => f.unidadId === unidExtDel.unidadId);
        let listaUnidadesExt = [];
        if(existeFext !== undefined){
            listaUnidadesExt = unidadesExternas.map( f => {
                if(f.unidadId === unidExtDel.unidadId){
                    f = unidExtDel;
                }
                return f;
            });
            setUnidadesExternas(listaUnidadesExt);
            setUnidadExtUpdate(false);

            withReactContent(Swal).fire({
                title: "Se eliminó correctamente",
                icon: "success"
            });

            console.log("BEFORE FRACEXT DELETE: ", listaUnidadesExt);

        }



        /*dispatch(setLoader(true));
        dispatch(deleteUnidad(unidadDelete)).then((resp) => {
            dispatch(setLoader(false));
            setUnidadUpdate(null);
            withReactContent(Swal).fire({
                title: "Se eliminó correctamente",
                icon: "success"
            })

        })*/
    };

    const isValidTypePreview = (type) => ArchivosProps.FILE_TYPES_PREVIEW.includes(type);

    const textoErrorCotas = unidadesExternasError ? 'Agregue al menos una colindancia' : 'Colindancias externas del proyecto';
    const createFilePreview = (file, isFileInput) => {
        setUrlDocumento(null);
        if(file && isFileInput && isValidTypePreview(file.type)){
            setUrlDocumento(URL.createObjectURL(file));
        }else {
            console.log("createFilePreview SHOW: ", file);
            setUrlDocumento(file && isValidTypePreview(file.tipo) ? import.meta.env.VITE_APP_API_BASE + "/docfiles/" + file.nombre : null);

        }
    }

    return (

        <Grid container spacing={3}>
            <Grid item md={4}>
                <Box display="flex" justifyContent="space-between">
                    <Header subtitle={ esEditar ? "Editando Proyecto" : "Nuevo Proyecto"}/>
                </Box>
            </Grid>
            <Grid item md={8}>
                <Box display="flex" justifyContent="space-between">
                    <Header subtitle="Documento de autorización"/>
                    <Box>
                        {proyecto.id && <Button
                            size="small"
                            color="warning"
                            variant="contained"
                            onClick={() => {
                                setOpenModal(true);
                            }}
                        >
                            <AddCircle sx={{mr: "10px"}}/>
                            Agregar archivos
                        </Button>}
                    </Box>
                </Box>
            </Grid>
            <Grid item md={12}>
                <Grid container spacing={3}>
                    <Grid item md={4} style={{ paddingTop: "0" }}>
                        <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={formState || initialValues}
                            validationSchema={checkoutSchema}
                            enableReinitialize
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
                                                label="Nombre desarrollo"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.titulo}
                                                name="titulo"
                                                error={!!touched.titulo && !!errors.titulo}
                                                helperText={touched.titulo && errors.titulo}
                                                color="secondary"
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <Autocomplete
                                                id="archivo"
                                                name="archivo"
                                                options={archivos}
                                                getOptionLabel={option => option.nombre}
                                                isOptionEqualToValue={(option, selectedValue) => {
                                                    return option.id === selectedValue.id;
                                                }}
                                                value={archivoSeleccionado}
                                                onChange={(e, value) => {
                                                    setFieldValue(
                                                        "archivo",
                                                        value !== null ? value : initialValues.archivo
                                                    );
                                                    setArchivoSeleccionado(value);
                                                    createFilePreview(value, true);

                                                }}
                                                renderInput={params => (
                                                    <TextField
                                                        label="Seleccione un documento"
                                                        fullWidth
                                                        variant="filled"
                                                        type="text"
                                                        name="archivo"
                                                        color="secondary"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        error={!!touched.archivo && !!errors.archivo}
                                                        helperText={touched.archivo && errors.archivo}
                                                        {...params}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <Autocomplete
                                                id="estado"
                                                name="estado"
                                                options={estados}
                                                getOptionLabel={option => option}
                                                value={estadoSeleccionado}
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
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <Autocomplete
                                                id="tipoDesarrollo"
                                                name="tipoDesarrollo"
                                                options={tiposDesarrollos}
                                                getOptionLabel={option => option.descripcion}
                                                value={tipoDesarrolloSeleccionado}
                                                onChange={(e, value) => {
                                                    setFieldValue(
                                                        "tipoDesarrollo",
                                                        value !== null ? value : initialValues.tipoDesarrollo
                                                    );
                                                    setTipoDesarrolloSeleccionado(value);
                                                }}
                                                renderInput={params => (
                                                    <TextField
                                                        label="Seleccion el tipo de desarrollo"
                                                        fullWidth
                                                        variant="filled"
                                                        type="text"
                                                        name="tipoDesarrollo"
                                                        color="secondary"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        error={!!touched.tipoDesarrollo && !!errors.tipoDesarrollo}
                                                        helperText={touched.tipoDesarrollo && errors.tipoDesarrollo}
                                                        {...params}
                                                    />
                                                )}
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
                                                        label="Uso general"
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
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Total unidades"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.totalUnidades}
                                                name="totalUnidades"
                                                color="secondary"
                                                error={!!touched.totalUnidades && !!errors.totalUnidades}
                                                helperText={touched.totalUnidades && errors.totalUnidades}
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Terreno total"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.terrenoTotal}
                                                name="terrenoTotal"
                                                color="secondary"
                                                error={!!touched.terrenoTotal && !!errors.terrenoTotal}
                                                helperText={touched.terrenoTotal && errors.terrenoTotal}
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Construcción total"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.construccionTotal}
                                                name="construccionTotal"
                                                color="secondary"
                                                error={!!touched.construccionTotal && !!errors.construccionTotal}
                                                helperText={touched.construccionTotal && errors.construccionTotal}
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Terreno exclusivo total"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.terrenoExclusivoTotal}
                                                name="terrenoExclusivoTotal"
                                                color="secondary"
                                                error={!!touched.terrenoExclusivoTotal && !!errors.terrenoExclusivoTotal}
                                                helperText={touched.terrenoExclusivoTotal && errors.terrenoExclusivoTotal}
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Construcción exclusiva total"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.construccionExclusivoTotal}
                                                name="construccionExclusivoTotal"
                                                color="secondary"
                                                error={!!touched.construccionExclusivoTotal && !!errors.construccionExclusivoTotal}
                                                helperText={touched.construccionExclusivoTotal && errors.construccionExclusivoTotal}
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Terreno común total"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.terrenoComunTotal}
                                                name="terrenoComunTotal"
                                                color="secondary"
                                                error={!!touched.terrenoComunTotal && !!errors.terrenoComunTotal}
                                                helperText={touched.terrenoComunTotal && errors.terrenoComunTotal}
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Construcción común total"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.construccionComunTotal}
                                                name="construccionComunTotal"
                                                color="secondary"
                                                error={!!touched.construccionComunTotal && !!errors.construccionComunTotal}
                                                helperText={touched.construccionComunTotal && errors.construccionComunTotal}
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="file"
                                                label="Seleccione autorización oficial del proyecto"
                                                InputLabelProps={{ shrink: true }}
                                                onBlur={handleBlur}
                                                name="documento"
                                                color="secondary"
                                                error={!!touched.documento && !!errors.documento}
                                                helperText={touched.documento && errors.documento}
                                                onChange={(e) => {
                                                    setFieldValue("documento", e.currentTarget.files[0]);
                                                    console.log("documento: ", e.currentTarget.files[0]);
                                                    createFilePreview(e.currentTarget.files[0], true);
                                                }}
                                            />
                                        </Grid>

                                    </Grid>
                                    <Grid item md={12} display="flex" justifyContent="end" mt="20px">
                                        <Button type="submit" color="secondary" variant="contained">
                                            Guardar
                                        </Button>
                                    </Grid>

                                </form>
                            )}
                        </Formik>
                    </Grid>
                    <Grid item md={8} style={{ paddingTop: "0" }}>
                        <PreviewFile urlFile={urlDocumento} />
                    </Grid>
                </Grid>
            </Grid>

            {/*<UnidadExternaModal openModal={openModal}
                                unidadExt={unidadExtUpdate}
                                handleEditRow={setUnidadExtUpdate}
                                handleSubmitModal={handleSubmitModal}
                                onCloseModal={setOpenModal}
            />*/}

            {proyecto && <ArchivosProyectoModal openModal={openModal}
                                proyectoId={proyecto.id}
                                handleSubmitModal={handleSubmitModal}
                                onCloseModal={setOpenModal}
            />}

        </Grid>


    );
};


const checkoutSchema = yup.object().shape({
    titulo: yup.string().required("required"),
    estado: yup.string().required("required"),
    municipio: yup.string().required("required"),
    localidad: yup.string().required("required"),
    //subtotal: yup.number().required("required"),
    uso: yup.string().required("required"),
    clase: yup.string().required("required"),

    tipoDesarrollo: yup.mixed().required("required"),
    totalUnidades: yup.number().required("required"),
    terrenoTotal: yup.number().required("required"),
    terrenoExclusivoTotal: yup.number().required("required"),
    terrenoComunTotal: yup.number().required("required"),
    construccionTotal: yup.number().required("required"),
    construccionExclusivoTotal: yup.number().required("required"),
    construccionComunTotal: yup.number().required("required"),

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
