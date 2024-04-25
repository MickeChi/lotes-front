import {
    Box,
    Divider, Grid,
    Paper,
    Tab,
    Tabs,
    useTheme
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {tokens} from "../../theme.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ProyectoService from "../../services/ProyectoService.js";
import ProyectoForm from "./ProyectoForm.jsx";
import {setLoader} from "../../store/slices/generalSlice.js";
import {useDispatch} from "react-redux";
import ProyectoDocumentos from "./ProyectoDocumentos.jsx";
import UnidadTab from "../unidad/UnidadTab.jsx";
import CotaTab from "../cotas/CotaTab.jsx";

const ProyectoShowPage = () => {
    const { proyectoId } = useParams();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();

    const [proyecto, setProyecto] = useState(null);

    const [currentTab, setCurrentTab] = useState(1);

    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    useEffect(() => {
        console.log("proyectoId: ", proyectoId);
        dispatch(setLoader(true));
        ProyectoService.getById(proyectoId)
            .then((response) => {
                if (response.data) {
                    const proyectoState = {...response.data, documento: ""};
                    for(const key in proyectoState){
                        if( key === "localidad" && (proyectoState[key] === null || proyectoState[key] === undefined)){
                            proyectoState[key] = "";
                        }
                    }
                    setProyecto(proyectoState);
                }
                dispatch(setLoader(false));
            }).catch((error) => {
            dispatch(setLoader(false));
            console.log("Error: ", error);
        });

    }, []);

    const handleEditProy = (proyEdit) => {
        console.log("handlerEditProy: ", proyEdit);
        setProyecto(proyEdit);
    }


    return (
        <Box m="20px">

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
                    <Tab value={2} label="Unidades" />
                    {/*<Tab value={3} label="Cotas" />*/}
                    <Tab value={4} label="Genera Documentos" />
                </Tabs>
                <Divider />

                <Box mt="20px">

                    {currentTab === 1 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {proyecto && <ProyectoForm handleEditProy={handleEditProy} proyecto={proyecto} esEditar/>}
                            </Grid>
                        </Grid>
                    )}

                    {currentTab === 2 && (
                        <UnidadTab proyectoId={proyectoId}></UnidadTab>
                    )}

                    {/*{currentTab === 3 && (
                        <CotaTab proyectoId={proyectoId} />
                    )}*/}

                    {currentTab === 4 && (
                        <Grid container>
                            <ProyectoDocumentos proyectoTitulo={proyecto.titulo} proyectoId={proyectoId}/>
                        </Grid>
                    )}

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
