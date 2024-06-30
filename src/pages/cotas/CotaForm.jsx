import {
    Autocomplete,
    Box,
    Button, FormControl, FormHelperText, Grid,
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
import {addCotaUnidad, createUnidad, updateUnidad} from "../../store/slices/unidadSlice.js";
import Checkbox from "@mui/material/Checkbox";
import {CheckBox, CheckBoxOutlineBlank} from "@mui/icons-material";
import {Estatus} from "../../utils/constantes.js";
import {addColindanciaCota, getAllColindancias, setColindancias} from "../../store/slices/colindanciaSlice.js";
import {toDecimals} from "../../utils/Utils.js";

const initialValues = {
    //"orden": "",
    "codigo": "",
    "tipoLinea": "",
    "orientacion": "",
    "medida": "",
    "unidadId": "",
    "colindanciaId": "",
    "colindanciaNueva": "",
    "estatus": Estatus.ACTIVO
}

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const CotaForm = ({cota, unidadId, proyectoId, handleUnidadSelect, handleEditRow}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formState, setFormState] = useState(cota || initialValues);
    const dispatch = useDispatch();
    const unidades = useSelector(state => state.unidades.unidades);
    const colindancias = useSelector(state => state.colindancias.colindancias);
    const [unidadSelect, setUnidadSelect] = useState(null);
    const [colindanciaSelect, setColindanciaSelect] = useState(null);
    const [esEditar, setEsEditar] = useState(false);

    const tiposLineas = ["RECTA", "CURVA"];
    const [tipoLineaSelect, setTipoLineaSelect] = useState(null);
    const orientaciones = ["NORTE", "SUR", "ESTE", "OESTE", "NOROESTE", "NORESTE", "SUROESTE", "SURESTE"];
    const [orientacionSelect, setOrientacionSelect] = useState(null);
    const [colindanciasForm, setColindanciasForm] = useState([]);
    const [showHeader, setShowHeader] = useState(false);
    const [showNuevaColindancia, setShowNuevaColindancia] = useState(false);


    useEffect(() => {
        const cargarColindancias = ()=>{
            let proyectoIdSel = proyectoId ? proyectoId : null;
            if(unidadId) {
                let unidadCurrent = unidadId ? unidades.find(u => u.id === unidadId) : null;
                setUnidadSelect(unidadCurrent);
                proyectoIdSel = unidadCurrent.proyectoId;
            }
            if(proyectoIdSel != null) {
                dispatch(setLoader(true));
                dispatch(getAllColindancias({proyectoId: proyectoIdSel})).then(resp => {
                    dispatch(setLoader(false));
                });
            }
        }

        if(unidadId || proyectoId) {
            cargarColindancias();
        }else{
            dispatch(setColindancias([]));
        }
    }, [unidadId, proyectoId]);

    useEffect(() => {
        let colNuevaOp = {
            "id": 0,
            "proyecto": null,
            "proyectoId": 0,
            "descripcion": "Nueva colindancia",
            "estatus": "ACTIVO"
        };
        if(colindancias.length > 0){
            let colidsForm = [colNuevaOp, ...colindancias];
            console.log("colindanciasForm: ", colidsForm);
            setColindanciasForm(colidsForm);
        }else{
            setColindanciasForm([colNuevaOp]);
        }
    }, [colindancias]);

    useEffect(() => {
        if(cota){
            setEsEditar(true);
            setFormState({...cota, colindanciaNueva: ""});
            let unidadSel = unidades.find(f => f.id === cota.unidadId);
            let colindanciaSel = colindancias.find(c => c.id === cota.colindanciaId);

            setUnidadSelect(unidadSel === undefined ? null : unidadSel);
            setColindanciaSelect(colindanciaSel === undefined ? null : colindanciaSel);
            setOrientacionSelect(cota.orientacion);
            setTipoLineaSelect(cota.tipoLinea);
        }else{
            handleReset();
        }
    }, [cota]);


    useEffect(() => {
        console.log("colindanciaSelect");
        if(colindanciaSelect && colindanciaSelect.id === 0){
            console.log("colindanciaSelect: ", colindanciaSelect);
            setShowNuevaColindancia(true);
        }else{
            setShowNuevaColindancia(false);
        }
    }, [colindanciaSelect]);

    /*useEffect(() => {
        handleReset();
        handleUnidadSelect(unidadSelect);
    }, [unidadSelect]);*/

    const handleFormSubmit = (values, actions) => {
        const actionSubmit = esEditar ? updateCota : createCota;
        //Si es crear y hay proyectoId, no se debe permitir ya que esto significa que se estan mostrando
        //las cotas sin colindancia y en ese flujo no es posible crear
        if(!esEditar && proyectoId){
            console.log("No es posible crear cotas en vista de cotas sin colindancia");
            return false;
        }
        let colindanciaReq = null;
        if(colindanciaSelect != null){
            let colindanciaDescript = values.colindanciaId === 0 ? values.colindanciaNueva : colindanciaSelect.descripcion;
            colindanciaReq = {...colindanciaSelect, descripcion: colindanciaDescript};
        }

        let request = {...values, unidadId: unidadSelect.id, colindancia: colindanciaReq, medida: toDecimals(values.medida)}
        delete request.colindanciaNueva;

        console.log("esEditar: " + esEditar + ", cotaRequest: ", request);

        dispatch(setLoader(true));
        dispatch(actionSubmit(request)).then((resp) => {
            console.log("respCota: ", resp.payload.colindancia);
            if(request.colindanciaId === 0){
                dispatch(addColindanciaCota(resp.payload.colindancia));
            }
            //Si se agrego una cota nueva esta se agrega a la unidad para que se muestre en el contador de cotas de la tabla de unidades
            if(!esEditar){
                dispatch(addCotaUnidad(resp.payload));
            }

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
        //setFormState({...initialValues, unidadId: (unidadSelect ? unidadSelect.id : "")});
        setFormState(initialValues);
        setEsEditar(false);
        setTipoLineaSelect(null);
        setOrientacionSelect(null);
        setColindanciaSelect(null);
        handleEditRow(null);
    }


    return (
        <Box>
            {showHeader && <Header subtitle="Nueva Cota"/>}
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
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item md={6}>
                                    <Autocomplete
                                        id="tipoLinea"
                                        name="tipoLinea"
                                        options={tiposLineas}
                                        getOptionLabel={option => option}
                                        value={tipoLineaSelect}
                                        size="small"
                                        onChange={(e, value) => {
                                            setFieldValue(
                                                "tipoLinea", value !== null ? value : initialValues.tipoLinea
                                            );
                                            setTipoLineaSelect(value);
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                label="Tipo de linea"
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
                                </Grid>

                                <Grid item md={6}>
                                    <Autocomplete
                                        id="orientacion"
                                        name="orientacion"
                                        options={orientaciones}
                                        getOptionLabel={option => option}
                                        value={orientacionSelect}
                                        size="small"
                                        onChange={(e, value) => {
                                            setFieldValue(
                                                "orientacion", value !== null ? value : initialValues.orientacion
                                            );
                                            setOrientacionSelect(value);
                                            //setOrientacionSelect(value !== null ? value : initialValues.orientacion);

                                        }}
                                        renderInput={params => (
                                            <TextField
                                                label="Rumbo"
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
                                </Grid>

                                <Grid item md={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Distancia"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.medida}
                                        size="small"
                                        name="medida"
                                        color="secondary"
                                        error={!!touched.medida && !!errors.medida}
                                        helperText={touched.medida && errors.medida}
                                    />
                                </Grid>

                                <Grid item md={6}>
                                    <Autocomplete
                                        id="colindanciaId"
                                        name="colindanciaId"
                                        options={colindanciasForm}
                                        getOptionLabel={option => {
                                            let labeltxt = option.id === 0 ? option.descripcion : `${option.id} - ${option.descripcion}`;
                                            return labeltxt;
                                        }}
                                        value={colindanciaSelect}
                                        size="small"
                                        onChange={(e, value) => {
                                            setFieldValue(
                                                "colindanciaId", value !== null ? value.id : initialValues.colindanciaId
                                            );
                                            setColindanciaSelect(value);
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                label="Colindancia"
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                name="colindanciaId"
                                                color="secondary"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                error={!!touched.colindanciaId && !!errors.colindanciaId}
                                                helperText={touched.colindanciaId && errors.colindanciaId}
                                                {...params}
                                            />
                                        )}
                                    />
                                </Grid>

                                {showNuevaColindancia &&
                                    <Grid item md={12}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            //disabled="true"
                                            type="text"
                                            label="Nueva colindancia"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.colindanciaNueva}
                                            name="colindanciaNueva"
                                            color="secondary"
                                            size="small"
                                            error={!!touched.colindanciaNueva && !!errors.colindanciaNueva}
                                            helperText={touched.colindanciaNueva && errors.colindanciaNueva}
                                        />
                                    </Grid>
                                }

                            </Grid>

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
    //"orden": yup.number().required("required"),
    "tipoLinea": yup.string().required("required"),
    "orientacion": yup.string().required("required"),
    "medida": yup.number().required("required")
    //"unidadId": yup.number().required("required"),
    /*"colindanciaId": yup.number().required("required"),
    "colindanciaNueva": yup.string().when("colindanciaId", {
        is: (val) => val === 0,
        then: yup.string().required('required'),
        otherwise: yup.string().notRequired()
    })*/
    // "colindanciasIds": yup.array().min(1, "al menos 1").max(1, "máximo 1").required("required"),
});


export default CotaForm;
