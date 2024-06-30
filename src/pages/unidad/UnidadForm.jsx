import {
    Autocomplete,
    Box,
    Button,
    FormControlLabel,
    TextField,
    useTheme
} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {tokens} from "../../theme.jsx";
import {useEffect, useState} from "react";
import Checkbox from "@mui/material/Checkbox";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {useDispatch, useSelector} from "react-redux";
import {setLoader} from "../../store/slices/generalSlice.js";
import {createUnidad, updateUnidad} from "../../store/slices/unidadSlice.js";
import {Estatus, orientaciones} from "../../utils/constantes.js";
import {addArchivo, getAllArchivos, setArchivos} from "../../store/slices/archivoSlice.js";
import {getTiposUnidades, getUsos} from "../../store/slices/catalogoSlice.js";

const initialValues = {
    lote: 0,
    numeroCatastral: 0,
    finca:"",
    tablaje: 0,
    colonia:"",
    folioElectronico: 0,
    puntoPartida: "",

    //superficieTerreno: 0,
    terrenoExclusivo: 0,
    terrenoComun:  0,

    //superficieConstruccion: 0,
    construccionExclusiva: 0,
    construccionComun:  0,
    cuotaPaIn:  0,

    valorCatastral: 0,
    uso:"",
    clase:"",
    tipoUnidad:"",
    colindanciaProyecto: false,
    numeroParcela: 0,
    documento: "",
    archivo: "",
    estatus: Estatus.ACTIVO
};

const UnidadForm = ({proyectoId, handleEditRow, unidad, handleFilePreview}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const archivos = useSelector(state => state.archivos.archivos);
    const tiposUnidades = useSelector(state => state.catalogos.tiposUnidades);
    const usos = useSelector(state => state.catalogos.usos);

    const [formState, setFormState] = useState(initialValues);
    const dispatch = useDispatch();
    const [esEditar, setEsEditar] = useState(false);

    const [tipoUnidadSeleccionado, setTipoUnidadSeleccionado] = useState(null);
    const [usoSeleccionado, setUsoSeleccionado] = useState(null);
    const [showHeader, setShowHeader] = useState(false);

    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

    const [puntoPartidaSelect, setPuntoPartidaSelect] = useState(null);


    useEffect(() => {
        const generaFormState = () =>{
            console.log("generaFormState: ", unidad);
            const unidadState = {...unidad};
            for(const key in unidadState){
                if(initialValues.hasOwnProperty(key) && (unidadState[key] === null || unidadState[key] === undefined)){
                    let nums = [];
                    unidadState[key] = initialValues[key];
                }
            }
            console.log("generaFormState: ", unidadState);
            setEsEditar(true);
            setFormState(unidadState);
            setPuntoPartidaSelect(unidadState.puntoPartida);
            //setUsoSeleccionado(unidadState.uso);
            //setTipoUnidadSeleccionado(unidadState.tipoUnidad);
            cargaArchivosProyecto();
            cargaTiposUnidades();
            cargaUsos();
        }

        if(unidad){
            generaFormState();
        }else{
            handleReset();
        }
    }, [unidad]);


    const cargaArchivosProyecto = () => {
        if(archivos.length === 0){
            dispatch(getAllArchivos({proyectoId: proyectoId})).then((resp) => {
                if(unidad && unidad.archivo){
                    let archivoSel = resp.payload.find(t => t.id === unidad.archivo.id);
                    setArchivoSeleccionado(archivoSel);
                }
            });
        }else{

            if(unidad && unidad.archivo){
                let archivoSel = archivos.find(t => t.id === unidad.archivo.id);
                setArchivoSeleccionado(archivoSel);
            }

        }
    }

    const cargaUsos = () => {
        if(usos.length === 0){
            dispatch(getUsos()).then((resp) => {
                console.log("cargaUsos: ", usos);

                if(unidad && unidad.uso){
                    let usoSel = resp.payload.find(t => t.id === unidad.uso.id);
                    console.log("cargaUsos: ", usoSel);
                    setUsoSeleccionado(usoSel);
                }
            });
        }else{
            if(unidad && unidad.uso){
                console.log("cargaUsos else: ", usos);
                let usoSel = usos.find(t => t.id === unidad.uso.id);
                console.log("cargaUsos usoSel else: ", usoSel);
                setUsoSeleccionado(usoSel);
            }
        }
    }

    const cargaTiposUnidades = () => {
        if(tiposUnidades.length === 0){

            dispatch(getTiposUnidades()).then((resp) => {
                console.log("cargaTiposUnidades: ", tiposUnidades);
                if(unidad && unidad.tipoUnidad){
                    let tipoUnidSel = resp.payload.find(t => t.id === unidad.tipoUnidad.id);
                    console.log("cargaTiposUnidades: ", tipoUnidSel);
                    setTipoUnidadSeleccionado(tipoUnidSel);
                }
            });
        }else{
            if(unidad && unidad.tipoUnidad){
                console.log("cargaTiposUnidades else: ", tiposUnidades);

                let tipoUnidSel = tiposUnidades.find(t => t.id === unidad.tipoUnidad.id);
                console.log("cargaTiposUnidades tipoUnidSel else: ", tipoUnidSel);
                setTipoUnidadSeleccionado(tipoUnidSel);
            }
        }
    }

    useEffect(() => {
        cargaArchivosProyecto();
        cargaTiposUnidades();
        cargaUsos();

        return () => {
            dispatch(setArchivos([]));
        };
    }, []);




    const handleFormSubmit = (values, actions) => {
        const actionSubmit = esEditar ? updateUnidad : createUnidad;
        const valuesRequest = {...values, proyectoId: proyectoId}

        console.log("esEditar: " + esEditar + ", unidadRequest: ", valuesRequest);

        dispatch(setLoader(true));
        dispatch(actionSubmit(valuesRequest)).then((resp) => {
            console.log("Unidad request: ", resp.payload);
            dispatch(setLoader(false));
            if(resp.payload && resp.payload.archivo){
                dispatch(addArchivo(resp.payload.archivo));
            }
            handleEditRow(resp.payload);
            //actions.resetForm();
            //handleReset();
            withReactContent(Swal).fire({
                title: "Se guardó correctamente",
                icon: "success"
            })
        })
    };

    const handleReset = () => {
        console.log("Reset form initialValues: ", initialValues);
        setFormState(initialValues);
        setEsEditar(false);
        setTipoUnidadSeleccionado(null);
        setUsoSeleccionado(null);
        setArchivoSeleccionado(null);
        handleEditRow(null);
    }

    return (
        <Box>
            {showHeader && <Header subtitle={esEditar ? "Editando Unidad" : "Nueva Unidad"}/>}
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={ formState || initialValues}
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
                                type="file"
                                label="Cargar plano"
                                InputLabelProps={{ shrink: true }}
                                onBlur={handleBlur}
                                name="documento"
                                color="secondary"
                                error={!!touched.documento && !!errors.documento}
                                helperText={touched.documento && errors.documento}
                                sx={{ gridColumn: "span 4" }}
                                size="small"
                                onChange={(e) => {
                                    setFieldValue("documento", e.currentTarget.files[0]);
                                    handleFilePreview(e.currentTarget.files[0], true);
                                    console.log("documento: ", e.currentTarget.files[0]);
                                }}
                            />
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
                                    handleFilePreview(value, true);

                                }}

                                size="small"
                                sx={{ gridColumn: "span 4" }}
                                renderInput={params => (
                                    <TextField
                                        label="Seleccione un documento"
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="archivo"
                                        color="secondary"
                                        size="small"
                                        sx={{ gridColumn: "span 2" }}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.archivo && !!errors.archivo}
                                        helperText={touched.archivo && errors.archivo}
                                        {...params}
                                    />
                                )}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Unidad"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.lote}
                                name="lote"
                                error={!!touched.lote && !!errors.lote}
                                helperText={touched.lote && errors.lote}
                                color="secondary"
                                size="small"
                                sx={{ gridColumn: "span 2" }}
                            />

                            <Autocomplete
                                id="tipoUnidad"
                                name="tipoUnidad"
                                options={tiposUnidades}
                                getOptionLabel={option => option.descripcion}
                                isOptionEqualToValue={(option, selectedValue) => {
                                    return option.id === selectedValue.id;
                                }}
                                value={tipoUnidadSeleccionado}
                                sx={{ gridColumn: "span 2" }}
                                size="small"
                                onChange={(e, value) => {
                                    setFieldValue(
                                        "tipoUnidad", value !== null ? value : initialValues.tipoUnidad
                                    );
                                    setTipoUnidadSeleccionado(value);
                                }}
                                renderInput={params => (
                                    <TextField
                                        label="Seleccione tipo"
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="tipoUnidad"
                                        color="secondary"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.tipoUnidad && !!errors.tipoUnidad}
                                        helperText={touched.tipoUnidad && errors.tipoUnidad}
                                        {...params}
                                    />
                                )}
                            />

                            <Autocomplete
                                id="uso"
                                name="uso"
                                options={usos}
                                getOptionLabel={option => option.descripcion}
                                isOptionEqualToValue={(option, selectedValue) => {
                                    return option.id === selectedValue.id;
                                }}
                                value={usoSeleccionado}
                                size="small"
                                sx={{ gridColumn: "span 2" }}
                                onChange={(e, value) => {
                                    setFieldValue(
                                        "uso", value !== null ? value : initialValues.uso
                                    );
                                    setUsoSeleccionado(value);
                                }}
                                renderInput={params => (
                                    <TextField
                                        label="Uso específico"
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
                                size="small"
                                error={!!touched.numeroCatastral && !!errors.numeroCatastral}
                                helperText={touched.numeroCatastral && errors.numeroCatastral}
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
                                size="small"
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
                                size="small"
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
                                size="small"
                                error={!!touched.folioElectronico && !!errors.folioElectronico}
                                helperText={touched.folioElectronico && errors.folioElectronico}
                                sx={{ gridColumn: "span 2" }}
                            />

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
                                size="small"
                                error={!!touched.numeroParcela && !!errors.numeroParcela}
                                helperText={touched.numeroParcela && errors.numeroParcela}
                                sx={{ gridColumn: "span 2" }}
                            />



                            {/*<TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Superficie de contrucción"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.superficieConstruccion}
                                name="superficieConstruccion"
                                color="secondary"
                                size="small"
                                error={!!touched.superficieConstruccion && !!errors.superficieConstruccion}
                                helperText={touched.superficieConstruccion && errors.superficieConstruccion}
                                sx={{ gridColumn: "span 2" }}
                            />*/}

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Terreno exclusivo"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.terrenoExclusivo}
                                name="terrenoExclusivo"
                                color="secondary"
                                size="small"
                                error={!!touched.terrenoExclusivo && !!errors.terrenoExclusivo}
                                helperText={touched.terrenoExclusivo && errors.terrenoExclusivo}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Construcción exclusiva"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.construccionExclusiva}
                                name="construccionExclusiva"
                                color="secondary"
                                size="small"
                                error={!!touched.construccionExclusiva && !!errors.construccionExclusiva}
                                helperText={touched.construccionExclusiva && errors.construccionExclusiva}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Terreno común"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.terrenoComun}
                                name="terrenoComun"
                                color="secondary"
                                size="small"
                                error={!!touched.terrenoComun && !!errors.terrenoComun}
                                helperText={touched.terrenoComun && errors.terrenoComun}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Construcción común"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.construccionComun}
                                name="construccionComun"
                                color="secondary"
                                size="small"
                                error={!!touched.construccionComun && !!errors.construccionComun}
                                helperText={touched.construccionComun && errors.construccionComun}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Cuota participación indiviso"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.cuotaPaIn}
                                name="cuotaPaIn"
                                color="secondary"
                                size="small"
                                error={!!touched.cuotaPaIn && !!errors.cuotaPaIn}
                                helperText={touched.cuotaPaIn && errors.cuotaPaIn}
                                sx={{ gridColumn: "span 2" }}
                            />


                            {/*<TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Superficie de Terreno"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.superficieTerreno}
                                name="superficieTerreno"
                                color="secondary"
                                size="small"
                                error={!!touched.superficieTerreno && !!errors.superficieTerreno}
                                helperText={touched.superficieTerreno && errors.superficieTerreno}
                                sx={{ gridColumn: "span 2" }}
                            />*/}

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
                                size="small"
                                error={!!touched.valorCatastral && !!errors.valorCatastral}
                                helperText={touched.valorCatastral && errors.valorCatastral}
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
                                size="small"
                                error={!!touched.clase && !!errors.clase}
                                helperText={touched.clase && errors.clase}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <Autocomplete
                                id="puntoPartida"
                                name="puntoPartida"
                                options={orientaciones}
                                getOptionLabel={option => option}
                                value={puntoPartidaSelect}
                                size="small"
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







                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px" cellSpacing={2}>
                            {/*{esEditar && <Button color="warning" variant="contained" onClick={() => {
                                handleReset()
                            }}>
                                Cancelar
                            </Button>}&nbsp;&nbsp;*/}
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
    lote: yup.number().required("required"),
    numeroCatastral: yup.number(),
    //finca: yup.string().required("required"),
    tablaje: yup.number().required("required"),
    //colonia: yup.string().required("required"),
    folioElectronico: yup.number(),
    valorCatastral: yup.number(),
    uso: yup.mixed().required("required"),
    clase: yup.string().required("required"),
    tipoUnidad: yup.mixed().required("required"),
    //colindanciaProyecto: yup.bool().required("required"),
    numeroParcela: yup.number(),

    //superficieTerreno: yup.number().required("required"),
    terrenoExclusivo: yup.number().required("required"),
    terrenoComun: yup.number().required("required"),

    //superficieConstruccion: yup.number().required("required"),
    construccionExclusiva: yup.number().required("required"),
    construccionComun: yup.number().required("required"),
    cuotaPaIn: yup.number().required("required"),
    puntoPartida: yup.string().required("required"),


    documento: yup.mixed()
        //.required("required")
        .nullable()
        .notRequired()
        .test("FILE_SIZE", "El tamaño del archivo es muy grande, maximo 15Mb",
            value => !value || (value && value.size <= 15000000))
        .test("FILE_FORMAT", "El tipo de archivo no es válido.",
            value => !value || (value && ["application/pdf", "image/jpeg"].includes(value.type)))

});


export default UnidadForm;
