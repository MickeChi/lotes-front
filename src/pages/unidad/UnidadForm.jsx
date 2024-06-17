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
import {Estatus} from "../../utils/constantes.js";
import {addArchivo, getAllArchivos} from "../../store/slices/archivoSlice.js";

const initialValues = {
    lote:"",
    numeroCatastral:"",
    finca:"",
    tablaje:"",
    colonia:"",
    folioElectronico:"",

    superficieTerreno:"",
    terrenoExclusivo:"",
    terrenoComun: "",

    superficieConstruccion:"",
    construccionExclusiva:"",
    construccionComun: "",
    cuotaPaIn: "",

    valorCatastral:"",
    uso:"",
    clase:"",
    tipoUnidad:"PARCELA",
    colindanciaProyecto: false,
    numeroParcela:"",
    documento: "",
    archivo: "",
    estatus: Estatus.ACTIVO
};

const UnidadForm = ({proyectoId, handleEditRow, unidad, handleFilePreview}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formState, setFormState] = useState(initialValues);
    const dispatch = useDispatch();
    const [esEditar, setEsEditar] = useState(false);

    const tiposUnidad = ["PARCELA", "VIALIDAD", "LOTE"];
    const [tipoUnidadSeleccionado, setTipoUnidadSeleccionado] = useState(null);

    const usos = ["HABITACIONAL", "COMERCIAL", "COMUN"];
    const [usoSeleccionado, setUsoSeleccionado] = useState(null);
    const [showHeader, setShowHeader] = useState(false);

    const archivos = useSelector(state => state.archivos.archivos);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

    useEffect(() => {
        const generaFormState = () =>{
            console.log("generaFormState: ", unidad);
            const unidadState = {...unidad};
            for(const key in unidadState){
                if(initialValues.hasOwnProperty(key) && (unidadState[key] === null || unidadState[key] === undefined)){
                    unidadState[key] = "";
                }
            }
            console.log("generaFormState: ", unidadState);
            setEsEditar(true);
            setFormState(unidadState);
            setUsoSeleccionado(unidadState.uso);
            setTipoUnidadSeleccionado(unidadState.tipoUnidad);
            cargaArchivosProyecto();
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
                if(unidad.archivo){
                    let archivoSel = resp.payload.find(t => t.id === unidad.archivo.id);
                    setArchivoSeleccionado(archivoSel);
                }
            });
        }else{

            if(unidad.archivo && esEditar){
                let archivoSel = archivos.find(t => t.id === unidad.archivo.id);
                setArchivoSeleccionado(archivoSel);
            }

        }
    }




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
                                label="Lote"
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
                                label="Contrucción exclusiva"
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
                                label="Contrucción común"
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
                                size="small"
                                error={!!touched.superficieTerreno && !!errors.superficieTerreno}
                                helperText={touched.superficieTerreno && errors.superficieTerreno}
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
                                size="small"
                                error={!!touched.valorCatastral && !!errors.valorCatastral}
                                helperText={touched.valorCatastral && errors.valorCatastral}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <Autocomplete
                                id="uso"
                                name="uso"
                                options={usos}
                                getOptionLabel={option => option}
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
                                id="tipoUnidad"
                                name="tipoUnidad"
                                options={tiposUnidad}
                                getOptionLabel={option => option}
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
    numeroCatastral: yup.number().required("required"),
    //finca: yup.string().required("required"),
    tablaje: yup.number().required("required"),
    //colonia: yup.string().required("required"),
    folioElectronico: yup.number(),
    valorCatastral: yup.number(),
    uso: yup.string().required("required"),
    clase: yup.string().required("required"),
    tipoUnidad: yup.string().required("required"),
    //colindanciaProyecto: yup.bool().required("required"),
    numeroParcela: yup.number(),

    //superficieTerreno: yup.number().required("required"),
    terrenoExclusivo: yup.number().required("required"),
    terrenoComun: yup.number().required("required"),

    //superficieConstruccion: yup.number().required("required"),
    construccionExclusiva: yup.number().required("required"),
    construccionComun: yup.number().required("required"),
    cuotaPaIn: yup.number().required("required"),

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
