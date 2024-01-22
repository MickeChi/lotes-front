import {
    Autocomplete,
    Box,
    Button, Card, CardActions, CardContent, FormControl, FormHelperText, Grid, Modal,
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
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {createFraccion, updateFraccion} from "../../store/slices/fraccionSlice.js";
import Checkbox from "@mui/material/Checkbox";
import {CheckBox, CheckBoxOutlineBlank} from "@mui/icons-material";
import CardHeader from "@mui/material/CardHeader";

const initialValues = {
    "orden": "",
    "tipoLinea": "",
    "orientacion": "",
    "medida": "",
    "fraccionId": "",
    "descripcion": ""
}



const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const ProyectoCotaModal = ({cota, handleEditRow, openModal, onCloseModal, handleSubmitModal}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formState, setFormState] = useState(cota || initialValues);
    const dispatch = useDispatch();
    const fracciones = useSelector(state => state.fracciones.fracciones);
    const [fraccionSelect, setFraccionSelect] = useState(null);
    const [esEditar, setEsEditar] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        border: '1px solid #555',
        backgroundColor: `${colors.primary[400]}`,
        boxShadow: 24,
    };


    const tiposLineas = ["RECTA", "CURVA"];
    const [tipoLineaSelect, setTipoLineaSelect] = useState(null);
    const orientaciones = ["NORTE", "SUR", "ESTE", "OESTE", "NOROESTE", "NORESTE", "SUROESTE", "SURESTE"];
    const [orientacionSelect, setOrientacionSelect] = useState(null);
    const [colindanciasSelect, setColindanciasSelect] = useState([]);

    useEffect(() => {
        if(cota){
            setEsEditar(true);
            setFormState(cota);
            let fraccionSel = fracciones.find(f => f.id === cota.fraccionId);
            setFraccionSelect(fraccionSel === undefined ? null : fraccionSel);
            setOrientacionSelect(cota.orientacion);
            setTipoLineaSelect(cota.tipoLinea);

            let colsSelect = fracciones.filter(f => {
                let existId = cota.colindanciasIds.find(cs => cs === f.id);
                return existId !== undefined;
            });
            setColindanciasSelect(colsSelect);
        }
    }, [cota]);

    useEffect(() => {
        handleReset();
    }, [fraccionSelect]);

    const handleFormSubmit = (values, actions) => {
        const actionSubmit = esEditar ? updateCota : createCota;
        const id = values.fraccionId !== "" ? values.fraccionId : crypto.randomUUID();
        const valuesRequest = {...values, fraccionId: id};
        console.log("esEditar: " + esEditar + ", cotaRequest: ", valuesRequest);
        handleSubmitModal(valuesRequest);
        actions.resetForm();
        handleReset();
        withReactContent(Swal).fire({
            title: "Se agregó correctamente",
            icon: "success"
        });
    };

    const handleReset = () => {
        console.log("Reset form initialValues: ", initialValues);
        //setFormState({...initialValues, fraccionId: (fraccionSelect ? fraccionSelect.id : "")});
        setFormState(initialValues);
        setEsEditar(false);
        setTipoLineaSelect(null);
        setOrientacionSelect(null);
        //setColindanciasSelect([]);
        handleEditRow(null);
        onCloseModal(false)
    }

    const handleCloseModal= () => onCloseModal(false);



    return (
        <div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
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
                                <Card sx={{
                                    backgroundColor: `${colors.primary[400]}`,
                                    backgroundImage: `none`
                                }}>
                                    <CardHeader sx={{
                                        borderBottom: '1px solid #555'
                                    }}
                                        title="Agregar cota proyecto"
                                    />
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item md={6}>
                                                <TextField
                                                    fullWidth
                                                    variant="filled"
                                                    type="text"
                                                    label="Descripcion"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.descripcion}
                                                    name="descripcion"
                                                    error={!!touched.descripcion && !!errors.descripcion}
                                                    helperText={touched.descripcion && errors.descripcion}
                                                    color="secondary"
                                                    //sx={{ gridColumn: "span 2" }}
                                                />
                                            </Grid>

                                            <Grid item md={6}>
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
                                                    //sx={{ gridColumn: "span 2" }}
                                                />
                                            </Grid>

                                            <Grid item md={6}>
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
                                            </Grid>

                                            <Grid item md={6}>
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
                                                    name="medida"
                                                    color="secondary"
                                                    error={!!touched.medida && !!errors.medida}
                                                    helperText={touched.medida && errors.medida}
                                                    sx={{ gridColumn: "span 2" }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions sx={{
                                        alignSelf: "stretch",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "flex-start",
                                        borderTop: '1px solid #555'
                                    }}>
                                        {esEditar && <Button color="warning" variant="contained" onClick={() => {
                                            handleReset()
                                        }}>
                                            Cancelar
                                        </Button>}&nbsp;&nbsp;
                                        <Button type="submit" color="secondary" variant="contained">
                                            Agregar
                                        </Button>
                                    </CardActions>
                                </Card>

                                {/*<Box display="flex" justifyContent="end" mt="20px" cellSpacing={2}>

                                </Box>*/}
                            </form>
                        )}
                    </Formik>

                </Box>

            </Modal>
        </div>
    );
};


const checkoutSchema = yup.object().shape({
    // "id": yup.string().required("required"),
    "orden": yup.number().required("required"),
    "tipoLinea": yup.string().required("required"),
    "orientacion": yup.string().required("required"),
    "medida": yup.number().required("required"),
    //"fraccionId": yup.number().required("required"),
    "descripcion": yup.string().required("required"),
});


export default ProyectoCotaModal;
