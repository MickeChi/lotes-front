import {
    Backdrop,
    Box,
    Button,
    CircularProgress, Divider, Grid,
    Paper,
    Tab,
    Tabs,
    tabsClasses,
    TextField,
    useTheme
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {tokens} from "../../theme.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ProyectoService from "../../services/ProyectoService.js";
import FraccionForm from "../fraccion/FraccionForm.jsx";
import FraccionTable from "../fraccion/FraccionTable.jsx";
import ProyectoForm from "./ProyectoForm.jsx";
import CotaForm from "../cotas/CotaForm.jsx";
import CotaTable from "../cotas/CotaTable.jsx";

const ProyectoShowPage = () => {
    const { proyectoId } = useParams();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [openLoader, setOpenLoader] = useState(false);
    const [proyecto, setProyecto] = useState(null);

    const [currentTab, setCurrentTab] = useState(1);

    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    useEffect(() => {
        console.log("proyectoId: ", proyectoId);
        setOpenLoader(true);
        ProyectoService.getProyecto(proyectoId)
            .then((response) => {
                if (response.data) {
                    setProyecto(response.data);
                }
                setOpenLoader(false);
            }).catch((error) => {
            setOpenLoader(false);
            console.log("Error: ", error);
        });

    }, []);



    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (
        <Box m="20px">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {proyecto && <Header title={proyecto.titulo} subtitle="Administre su proyecto"/>}

            <Paper sx={{
                backgroundColor: `${colors.primary[400]}`,
                my: { xs: 3, md: 3 }, p: { xs: 2, md: 3 }
            }}>
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    textColor="primary"
                    indicatorColor="secondary"
                    sx={{
                        ".Mui-selected": {
                            color: `#e0e0e0 !important`,
                            fontWeight: `bold`
                        },
                    }}
                >
                    <Tab value={1} label="Proyecto" />
                    <Tab value={2} label="Fracciones" />
                    <Tab value={3} label="Cotas" />
                    <Tab value={4} label="Cotas Proyecto" />
                </Tabs>
                <Divider />

                <Box>

                    {currentTab === 1 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {proyecto && <ProyectoForm proyecto={proyecto}/>}
                            </Grid>
                        </Grid>
                    )}

                    {currentTab === 2 && (
                        <Grid container>
                            <Grid item md={6}>
                                <FraccionForm/>
                            </Grid>
                            <Grid item md={6}>
                                <FraccionTable/>
                            </Grid>
                        </Grid>
                    )}

                    {currentTab === 3 && (
                        <Grid container>
                            <Grid item md={6}>
                                <CotaForm/>
                            </Grid>
                            <Grid item md={6}>
                                <CotaTable/>
                            </Grid>
                        </Grid>
                    )}

                    {currentTab === 4 && (<h1>CONTENT TAB4</h1>)}

                    {/*
                    {currentTab === 'grupos-listas' && <GruposListasTab />}
                    {currentTab === 'tipos-listas' && <TiposListasTab />}
                    {currentTab === 'tipos-usuarios' && <TiposUsuariosTab />}
                    */}
                </Box>
            </Paper>
        </Box>
    );
};

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    contact: yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("required"),
    address1: yup.string().required("required"),
    address2: yup.string().required("required"),
});
const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address1: "",
    address2: "",
};

export default ProyectoShowPage;
