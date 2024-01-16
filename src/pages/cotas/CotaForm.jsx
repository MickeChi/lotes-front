import {
    Autocomplete,
    Box,
    Button, FormControl, FormHelperText,
    TextField, Typography,
    useTheme
} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {tokens} from "../../theme.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setLoader} from "../../store/slices/generalSlice.js";
import {createCota, getAllCotas, setCotas, updateCota} from "../../store/slices/cotaSlice.js";
import ColindanciaTransList from "./ColindanciaTransList.jsx";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {createFraccion, updateFraccion} from "../../store/slices/fraccionSlice.js";

const initialValues = {
    "orden": "",
    "tipoLinea": "",
    "orientacion": "",
    "medida": "",
    "fraccionId": "",
    "colindanciasIds": []
}

const CotaForm = ({cota, handleFraccionSelect}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formState, setFormState] = useState(initialValues);
    const dispatch = useDispatch();
    const fracciones = useSelector(state => state.fracciones.fracciones);
    const [fraccionSelect, setFraccionSelect] = useState(null);
    const [esEditar, setEsEditar] = useState(false);


    const tiposLineas = ["RECTA", "CURVA"];
    const [tipoLineaSelect, setTipoLineaSelect] = useState(null);

    const orientaciones = ["NORTE", "SUR", "ESTE", "OESTE", "NOROESTE", "NORESTE", "SUROESTE", "SURESTE"];
    const [orientacionSelect, setOrientacionSelect] = useState(null);

    const [colindanciasIds, setColindanciasIds] = useState([]);
    const [colindanciasError, setColindanciasError] = useState(false);

    const [colindsIdsSelect, setColindsIdsSelect] = useState([]);


    useEffect(() => {
        if(cota){
            console.log("cotaForm: ", cota);
            setEsEditar(true);
            setFormState(cota);
            let fraccionSel = fracciones.find(f => f.id === cota.fraccionId);
            setFraccionSelect(fraccionSel === undefined ? null : fraccionSel);
            setOrientacionSelect(cota.orientacion);
            setTipoLineaSelect(cota.tipoLinea);
            setColindsIdsSelect(cota.colindanciasIds);
        }
    }, [cota]);

    useEffect(() => {
        console.log("useEfect fraccionSelect: ", fraccionSelect);
        handleReset();
        handleFraccionSelect(fraccionSelect);
    }, [fraccionSelect]);

    const handleFormSubmit = (values, actions) => {
        if(colindanciasIds.length === 0){
            setColindanciasError(true);
            return;
        }
        console.log("Submit cota...: ", values);
        const actionSubmit = esEditar ? updateCota : createCota;
        const valuesRequest = {...values, colindanciasIds: colindanciasIds}
        console.log("esEditar: " + esEditar + ", cotaRequest: ", valuesRequest);

        dispatch(setLoader(true));
        dispatch(actionSubmit(valuesRequest)).then(() => {
            dispatch(setLoader(false));
            handleReset();
            withReactContent(Swal).fire({
                title: "Se guardó correctamente",
                icon: "success"
            })

        })
    };

    const handleReset = () => {
        console.log("Reset form initialValues: ", initialValues);
        setFormState({...initialValues, fraccionId: (fraccionSelect ? fraccionSelect.id : "")});
        setEsEditar(false);
        setTipoLineaSelect(null);
        setOrientacionSelect(null);
        setColindanciasError(false);
        setColindanciasIds([]);
        setColindsIdsSelect([]);
    }


    const colindanciasHandler = (colindanciasSelect) => {
        console.log("colindanciasHandler: ", colindanciasSelect)
        let colindanciasIds = colindanciasSelect.map(c => c.id);
        if(colindanciasIds.length > 0){
            setColindanciasError(false);
        }
        setColindanciasIds(colindanciasIds);
    }

    return (
        <Box>
            <Header subtitle="Nueva Cota"/>
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
                            <Autocomplete
                                id="fraccionId"
                                name="fraccionId"
                                options={fracciones}
                                getOptionLabel={option => `Lote: ${option.lote} - Número catastral: ${option.numeroCatastral}`}
                                value={fraccionSelect}
                                sx={{ gridColumn: "span 4" }}
                                onChange={(e, value) => {
                                    setFieldValue(
                                        "fraccionId", value !== null ? value.id : initialValues.fraccionId
                                    );
                                    setFraccionSelect(value);
                                }}
                                renderInput={params => (
                                    <TextField
                                        label="Seleccion una fracción"
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="fraccionId"
                                        color="secondary"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.fraccionId && !!errors.fraccionId}
                                        helperText={touched.fraccionId && errors.fraccionId}
                                        {...params}
                                    />
                                )}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Orden"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.orden}
                                name="orden"
                                error={!!touched.orden && !!errors.orden}
                                helperText={touched.orden && errors.orden}
                                color="secondary"
                                sx={{ gridColumn: "span 2" }}
                            />


                            <Autocomplete
                                id="tipoLinea"
                                name="tipoLinea"
                                options={tiposLineas}
                                getOptionLabel={option => option}
                                value={tipoLineaSelect}
                                sx={{ gridColumn: "span 2" }}
                                onChange={(e, value) => {
                                    setFieldValue(
                                        "tipoLinea", value !== null ? value : initialValues.tipoLinea
                                    );
                                    setTipoLineaSelect(value);
                                    //setTipoLineaSelect(value !== null ? value : initialValues.tipoLinea);

                                }}
                                renderInput={params => (
                                    <TextField
                                        label="Seleccione tipo de linea"
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="tipoLinea"
                                        color="secondary"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.tipoLinea && !!errors.tipoLinea}
                                        helperText={touched.tipoLinea && errors.tipoLinea}
                                        {...params}
                                    />
                                )}
                            />


                            <Autocomplete
                                id="orientacion"
                                name="orientacion"
                                options={orientaciones}
                                getOptionLabel={option => option}
                                value={orientacionSelect}
                                sx={{ gridColumn: "span 2" }}
                                onChange={(e, value) => {
                                    setFieldValue(
                                        "orientacion", value !== null ? value : initialValues.orientacion
                                    );
                                    setOrientacionSelect(value);
                                    //setOrientacionSelect(value !== null ? value : initialValues.orientacion);

                                }}
                                renderInput={params => (
                                    <TextField
                                        label="Seleccione el rumbo"
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="orientacion"
                                        color="secondary"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.orientacion && !!errors.orientacion}
                                        helperText={touched.orientacion && errors.orientacion}
                                        {...params}
                                    />
                                )}
                            />


                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Distancia"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.medida}
                                name="medida"
                                color="secondary"
                                error={!!touched.medida && !!errors.medida}
                                helperText={touched.medida && errors.medida}
                                sx={{ gridColumn: "span 2" }}
                            />
                        </Box>
                        <Box mt="20px">
                            <Typography variant="h6"  sx={{ mb: "15px" }}>
                                Seleccione las colindancias
                            </Typography>
                            <ColindanciaTransList onChange={colindanciasHandler} colindanciasSelected={colindsIdsSelect}/>
                            {colindanciasError && <FormControl error variant="standard">
                                <FormHelperText id="colindanciaTransList">Debe Seleccionar al menos una
                                    colindancia</FormHelperText>
                            </FormControl>}
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
   // "id": yup.string().required("required"),
    "orden": yup.number().required("required"),
    "tipoLinea": yup.string().required("required"),
    "orientacion": yup.string().required("required"),
    "medida": yup.number().required("required"),
    "fraccionId": yup.number().required("required"),
    //"colindanciasIds": yup.array().min(1, "at least 1").required("required"),
});


export default CotaForm;
