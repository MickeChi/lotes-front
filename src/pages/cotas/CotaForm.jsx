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
import Checkbox from "@mui/material/Checkbox";
import {CheckBox, CheckBoxOutlineBlank} from "@mui/icons-material";
import {Estatus} from "../../utils/constantes.js";

const initialValues = {
    "orden": "",
    "tipoLinea": "",
    "orientacion": "",
    "medida": "",
    "fraccionId": "",
    "colindanciasIds": [],
    "estatus": Estatus.ACTIVO
}

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const CotaForm = ({cota, handleFraccionSelect, handleEditRow}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formState, setFormState] = useState(cota || initialValues);
    const dispatch = useDispatch();
    const fracciones = useSelector(state => state.fracciones.fracciones);
    const [fraccionSelect, setFraccionSelect] = useState(null);
    const [esEditar, setEsEditar] = useState(false);

    const tiposLineas = ["RECTA", "CURVA"];
    const [tipoLineaSelect, setTipoLineaSelect] = useState(null);
    const orientaciones = ["NORTE", "SUR", "ESTE", "OESTE", "NOROESTE", "NORESTE", "SUROESTE", "SURESTE"];
    const [orientacionSelect, setOrientacionSelect] = useState(null);
    const [colindanciasSelect, setColindanciasSelect] = useState([]);
    const [fraccionesForm, setFraccionesForm] = useState([]);
    const [colindanciasForm, setColindanciasForm] = useState([]);


    useEffect(() => {
        if(fracciones.length > 0){
            console.log("fracciones : ", fracciones);
            let fraccsForm = fracciones.filter(f => !f.colindanciaProyecto);
            console.log("fraccionesForm: ", fraccsForm);
            setFraccionesForm(fraccsForm);

            let colidsForm = [];
            fracciones.forEach(f => {
                let label = f.colindanciaProyecto ? f.descripcion : `Lote: ${f.lote} - Número catastral: ${f.numeroCatastral}`;
                colidsForm.push({...f, label})
            });
            console.log("colindanciasForm: ", colidsForm);
            setColindanciasForm(colidsForm);
        }

    }, [fracciones]);

    useEffect(() => {
        if(cota){
            setEsEditar(true);
            setFormState(cota);
            let fraccionSel = fracciones.find(f => f.id === cota.fraccionId);
            setFraccionSelect(fraccionSel === undefined ? null : fraccionSel);
            setOrientacionSelect(cota.orientacion);
            setTipoLineaSelect(cota.tipoLinea);

            let colsSelect = colindanciasForm.filter(f => {
                let existId = cota.colindanciasIds.find(cs => cs === f.id);
                return existId !== undefined;
            });
            setColindanciasSelect(colsSelect);
        }else{
            handleReset();
        }
    }, [cota]);

    useEffect(() => {
        handleReset();
        handleFraccionSelect(fraccionSelect);
    }, [fraccionSelect]);

    const handleFormSubmit = (values, actions) => {
        const actionSubmit = esEditar ? updateCota : createCota;
        const valuesRequest = {...values}
        console.log("esEditar: " + esEditar + ", cotaRequest: ", valuesRequest);

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
        setFormState({...initialValues, fraccionId: (fraccionSelect ? fraccionSelect.id : "")});
        setEsEditar(false);
        setTipoLineaSelect(null);
        setOrientacionSelect(null);
        setColindanciasSelect([]);
        handleEditRow(null);
    }


    return (
        <Box>
            <Header subtitle="Nueva Cota"/>
            <Formik

                onSubmit={handleFormSubmit}
                initialValues={formState}
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
                                options={fraccionesForm}
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


                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                id="colindanciasIds"
                                name="colindanciasIds"
                                options={colindanciasForm}
                                getOptionLabel={option => option.label}
                                value={colindanciasSelect}
                                sx={{ gridColumn: "span 4" }}
                                onChange={(e, value) => {
                                    let colIds = value !== null ? (value.map(v=> v.id)) : initialValues.colindanciasIds
                                    console.log("colIds: ", colIds);
                                    setFieldValue(
                                        "colindanciasIds", colIds
                                    );
                                    setColindanciasSelect(value);
                                }}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            color="secondary"
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.label}
                                    </li>
                                )}
                                renderInput={params => (
                                    <TextField
                                        label="Seleccione las colindancias"
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="colindanciasIds"
                                        color="secondary"
                                        placeholder="Colindancias"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.colindanciasIds && !!errors.colindanciasIds}
                                        helperText={touched.colindanciasIds && errors.colindanciasIds}
                                        {...params}
                                    />
                                )}
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
   // "id": yup.string().required("required"),
    "orden": yup.number().required("required"),
    "tipoLinea": yup.string().required("required"),
    "orientacion": yup.string().required("required"),
    "medida": yup.number().required("required"),
    "fraccionId": yup.number().required("required"),
    "colindanciasIds": yup.array().min(1, "al menos 1").max(1, "máximo 1").required("required"),
});


export default CotaForm;
