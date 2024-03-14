import {
    Autocomplete,
    Box,
    Button, Card, CardActions, CardContent, Grid, Modal,
    TextField,
    useTheme
} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {tokens} from "../../theme.jsx";
import {useEffect, useState} from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CardHeader from "@mui/material/CardHeader";
import {Estatus} from "../../utils/constantes.js";

const initialValues = {
    "fraccionId": null,
    "proyectoId": null,
    "cotaId": null,
    "orden": "",
    "tipoLinea": "",
    "orientacion": "",
    "medida": "",
    "descripcion": "",
    "colindanciaProyecto": true,
    "estatus": Estatus.ACTIVO
}

const FraccionExternaModal = ({fraccionExt, handleEditRow, openModal, onCloseModal, handleSubmitModal}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formState, setFormState] = useState(fraccionExt || initialValues);
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

    useEffect(() => {
        console.log("useEffect fraccionModal: ", openModal)
        return () => {
            console.log("callback fraccionModal: ", openModal);
            if(openModal){
                console.log("RESET fraccionModal: ", openModal);
                handleReset();
            }
        };
    }, [openModal]);

    useEffect(() => {
        if(fraccionExt){
            setEsEditar(true);
            setFormState(fraccionExt);
            setOrientacionSelect(fraccionExt.orientacion);
            setTipoLineaSelect(fraccionExt.tipoLinea);
        }
    }, [fraccionExt]);

    const handleFormSubmit = (values, actions) => {
        const id = values.fraccionId !== null ? values.fraccionId : crypto.randomUUID();
        const valuesRequest = {...values, fraccionId: id};
        console.log("esEditar: " + esEditar + ", fraccionExtRequest: ", valuesRequest);
        handleSubmitModal(valuesRequest);
        actions.resetForm();
        onCloseModal(false);
        withReactContent(Swal).fire({
            title: "Se agregó correctamente",
            icon: "success"
        });
    };

    const handleReset = () => {
        console.log("Reset form initialValues: ", initialValues);
        setFormState(initialValues);
        setEsEditar(false);
        setTipoLineaSelect(null);
        setOrientacionSelect(null);
        handleEditRow(null);
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
                                        title="Agregar fraccionExt proyecto"
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
                                            onCloseModal(false);
                                        }}>
                                            Cancelar
                                        </Button>}&nbsp;&nbsp;
                                        <Button type="submit" color="secondary" variant="contained">
                                            { esEditar ? 'Actualizar' : 'Agregar'}
                                        </Button>
                                    </CardActions>
                                </Card>

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


export default FraccionExternaModal;
