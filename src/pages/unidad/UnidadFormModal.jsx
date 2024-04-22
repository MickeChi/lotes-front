import {
    Autocomplete,
    Box,
    Button, Card, CardActions, CardContent,
    FormControlLabel, Grid,
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
import {createUnidad, updateUnidad} from "../../store/slices/unidadSlice.js";
import {Estatus} from "../../utils/constantes.js";
import CardHeader from "@mui/material/CardHeader";
import Modal from "@mui/material/Modal";

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
    tipoUnidad:"PARCELA",
    colindanciaProyecto: false,
    numeroParcela:"",
    documento: "",
    estatus: Estatus.ACTIVO
};

const UnidadFormModal = ({proyectoId, handleEditRow, unidad, openModal, onCloseModal}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formState, setFormState] = useState(unidad || initialValues);
    const dispatch = useDispatch();
    const [esEditar, setEsEditar] = useState(false);
    const [urlDocumento, setUrlDocumento] = useState(null);


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        border: '1px solid #555',
        backgroundColor: `${colors.primary[400]}`,
        boxShadow: 24,
    };

    const tiposUnidad = ["PARCELA", "VIALIDAD", "LOTE"];
    const [tipoUnidadSeleccionado, setTipoUnidadSeleccionado] = useState(null);

    const usos = ["HABITACIONAL", "COMERCIAL", "COMUN"];
    const [usoSeleccionado, setUsoSeleccionado] = useState(null);

    useEffect(() => {
        console.log("useEffect UnidadModal: ", openModal)
        return () => {
            console.log("callback UnidadModal: ", openModal);
            if(openModal){
                console.log("RESET UnidadModal: ", openModal);
                handleReset();
            }
        };
    }, [openModal]);

    useEffect(() => {
        const generaFormState = () =>{
            console.log("unidadForm: ", unidad);
            const unidadState = {...unidad};
            for(const key in unidadState){
                if(initialValues.hasOwnProperty(key) && (unidadState[key] === null || unidadState[key] === undefined)){
                    unidadState[key] = "";
                }
            }
            console.log("unidadState: ", unidadState);
            setEsEditar(true);
            setFormState(unidadState);
            setUsoSeleccionado(unidadState.uso);
            setTipoUnidadSeleccionado(unidadState.tipoUnidad);
            setUrlDocumento(unidad.nombreDocumento ? import.meta.env.VITE_APP_API_BASE + "/docfiles/" + unidad.nombreDocumento : null);

        }

        if(unidad){
            generaFormState();
        }else{
            handleReset();
        }
    }, [unidad]);

    const handleFormSubmit = (values, actions) => {
        const actionSubmit = esEditar ? updateUnidad : createUnidad;
        const valuesRequest = {...values, proyectoId: proyectoId}

        console.log("esEditar: " + esEditar + ", unidadRequest: ", valuesRequest);

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
        setTipoUnidadSeleccionado(null);
        setUsoSeleccionado(null);
        handleEditRow(null);
        onCloseModal(false);
    }

    return (
        <div>
            <Modal
                open={openModal}
                onClose={()=> onCloseModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{zIndex: 10001}}
            >
                <Box sx={style}>

                    {/*<Header subtitle={ esEditar ? "Editando Unidad" : "Nueva Unidad"}/>*/}

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
                                <Card sx={{
                                    backgroundColor: `${colors.primary[400]}`,
                                    backgroundImage: `none`
                                }}>
                                    <CardHeader sx={{
                                        borderBottom: '1px solid #555'
                                    }}
                                                title={ esEditar ? "Editando Unidad" : "Nueva Unidad"}
                                    />
                                    <CardContent>
                                        <Grid container spacing={3} m={0}>
                                            <Grid item md={4} style={{ paddingTop: "0" }}>
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
                                                    {/*<TextField
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
                            />*/}

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
                                                        id="tipoUnidad"
                                                        name="tipoUnidad"
                                                        options={tiposUnidad}
                                                        getOptionLabel={option => option}
                                                        value={tipoUnidadSeleccionado}
                                                        sx={{ gridColumn: "span 2" }}
                                                        onChange={(e, value) => {
                                                            setFieldValue(
                                                                "tipoUnidad", value !== null ? value : initialValues.tipoUnidad
                                                            );
                                                            setTipoUnidadSeleccionado(value);
                                                        }}
                                                        renderInput={params => (
                                                            <TextField
                                                                label="Seleccione tipo de colindancia"
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

                                                    <TextField
                                                        fullWidth
                                                        variant="filled"
                                                        type="file"
                                                        label="Seleccione autorización del proyecto"
                                                        InputLabelProps={{ shrink: true }}
                                                        onBlur={handleBlur}
                                                        //onChange={handleChange}
                                                        //value={values.documento}
                                                        name="documento"
                                                        color="secondary"
                                                        error={!!touched.documento && !!errors.documento}
                                                        helperText={touched.documento && errors.documento}
                                                        sx={{ gridColumn: "span 4" }}
                                                        onChange={(e) => {
                                                            setFieldValue("documento", e.currentTarget.files[0]);
                                                            console.log("documento: ", e.currentTarget.files[0]);
                                                            /*setPuntoPartidaSelect(value);*/
                                                        }}
                                                    />



                                                </Box>
                                                {/*<Box display="flex" justifyContent="end" mt="20px" cellSpacing={2}>
                                    {esEditar && <Button color="warning" variant="contained" onClick={() => {
                                        handleReset()
                                    }}>
                                        Cancelar
                                    </Button>}&nbsp;&nbsp;
                                    <Button type="submit" color="secondary" variant="contained">
                                        Guardar
                                    </Button>
                                </Box>*/}

                                            </Grid>
                                            <Grid item md={8} style={{ paddingTop: "0" }}>
                                                <Grid container>


                                                    {
                                                        urlDocumento && (
                                                    <Grid item md={12}>
                                                        <iframe className="pdf"
                                                                src={urlDocumento}
                                                                width="100%" height="520">
                                                        </iframe>
                                                    </Grid>
                                                    )
                                                    }


                                                </Grid>
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
                                        {/*{esEditar && <Button color="warning" variant="contained" onClick={() => {
                                            onCloseModal(false);
                                        }}>
                                            Cancelar
                                        </Button>}&nbsp;&nbsp; */}

                                        <Button color="warning" variant="contained" onClick={() => {
                                            handleReset()
                                        }}>
                                            Cerrar
                                        </Button>&nbsp;&nbsp;

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
    tipoUnidad: yup.string().required("required"),
    //colindanciaProyecto: yup.bool().required("required"),
    //numeroParcela: yup.number().required("required"),
    documento: yup.mixed()
        //.required("required")
        .nullable()
        .notRequired()
        .test("FILE_SIZE", "El tamaño del archivo es muy grande, maximo 15Mb",
            value => !value || (value && value.size <= 15000000))
        .test("FILE_FORMAT", "El tipo de archivo no es válido.",
            value => !value || (value && ["application/pdf", "image/jpeg"].includes(value.type)))

});


export default UnidadFormModal;
