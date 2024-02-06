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
import {useDispatch} from "react-redux";
import {setLoader} from "../../store/slices/generalSlice.js";
import {createFraccion, updateFraccion} from "../../store/slices/fraccionSlice.js";

const initialValues = {
    lote:"",
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
    tipoFraccion:"PARCELA",
    colindanciaProyecto: false,
    numeroParcela:"",
};

const FraccionForm = ({proyectoId, handleEditRow, fraccion}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formState, setFormState] = useState(fraccion || initialValues);
    const dispatch = useDispatch();
    const [esEditar, setEsEditar] = useState(false);

    const tiposFraccion = ["PARCELA", "VIALIDAD", "LOTE"];
    const [tipoFraccionSeleccionado, setTipoFraccionSeleccionado] = useState(null);

    const usos = ["HABITACIONAL", "COMERCIAL", "COMUN"];
    const [usoSeleccionado, setUsoSeleccionado] = useState(null);

    useEffect(() => {
        const generaFormState = () =>{
            console.log("fraccionForm: ", fraccion);
            const fraccionState = {...fraccion};
            for(const key in fraccionState){
                if(initialValues.hasOwnProperty(key) && (fraccionState[key] === null || fraccionState[key] === undefined)){
                    fraccionState[key] = "";
                }
            }
            console.log("fraccionState: ", fraccionState);
            setEsEditar(true);
            setFormState(fraccionState);
            setUsoSeleccionado(fraccionState.uso);
            setTipoFraccionSeleccionado(fraccionState.tipoFraccion);
        }

        if(fraccion){
            generaFormState();
        }
    }, [fraccion]);

    const handleFormSubmit = (values, actions) => {
        const actionSubmit = esEditar ? updateFraccion : createFraccion;
        const valuesRequest = {...values, proyectoId: proyectoId}

        console.log("esEditar: " + esEditar + ", fraccionRequest: ", valuesRequest);

        dispatch(setLoader(true));
        dispatch(actionSubmit(valuesRequest)).then(() => {
            dispatch(setLoader(false));
            actions.resetForm();
            handleReset();
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
        setTipoFraccionSeleccionado(null);
        setUsoSeleccionado(null);
        handleEditRow(null);
    }

    return (
        <Box>
            <Header subtitle="Nueva Fracción"/>
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
                                type="text"
                                label="Lote"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.lote}
                                name="lote"
                                error={!!touched.lote && !!errors.lote}
                                helperText={touched.lote && errors.lote}
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
                                id="tipoFraccion"
                                name="tipoFraccion"
                                options={tiposFraccion}
                                getOptionLabel={option => option}
                                value={tipoFraccionSeleccionado}
                                sx={{ gridColumn: "span 2" }}
                                onChange={(e, value) => {
                                    setFieldValue(
                                        "tipoFraccion", value !== null ? value : initialValues.tipoFraccion
                                    );
                                    setTipoFraccionSeleccionado(value);
                                }}
                                renderInput={params => (
                                    <TextField
                                        label="Seleccione tipo de colindancia"
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="tipoFraccion"
                                        color="secondary"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.tipoFraccion && !!errors.tipoFraccion}
                                        helperText={touched.tipoFraccion && errors.tipoFraccion}
                                        {...params}
                                    />
                                )}
                            />


                            {/*<FormControlLabel control={
                                <Checkbox color="secondary" checked={values.colindanciaProyecto} />
                            }
                                              name="colindanciaProyecto"
                                              onChange={handleChange}
                                              label="Colindancia proyecto"
                                              sx={{ gridColumn: "span 2" }}/>
*/}


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
                        <Box display="flex" justifyContent="end" mt="20px" cellSpacing={2}>
                            {esEditar && <Button color="warning" variant="contained" onClick={() => {
                                handleReset()
                            }}>
                                Cancelar
                            </Button>}&nbsp;&nbsp;
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
    //folioElectronico: yup.number().required("required"),
    superficieTerreno: yup.number().required("required"),
    superficieConstruccion: yup.number().required("required"),
    //valorCatastral: yup.number().required("required"),
    uso: yup.string().required("required"),
    clase: yup.string().required("required"),
    tipoFraccion: yup.string().required("required"),
    //colindanciaProyecto: yup.bool().required("required"),
    //numeroParcela: yup.number().required("required"),

});


export default FraccionForm;
