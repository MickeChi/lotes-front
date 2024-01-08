import {Autocomplete, Backdrop, Box, CircularProgress, Grid, TextField, Typography, useTheme} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme.jsx";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import CotaForm from "../cotas/CotaForm.jsx";
import CotaTable from "../cotas/CotaTable.jsx";
import {useState} from "react";

const CotaTab = () => {
    const theme = useTheme();
    const [fracciones, setFracciones] = useState([]);
    const [fraccionSeleccionado, setFraccionSeleccionado] = useState(null);
    const colors = tokens(theme.palette.mode);


    return (
        <Grid container>
            <Grid item md={12}>
                <Box m="20px">
                    <Header subtitle="Administrar cotas"/>
                    <Autocomplete
                        id="fraccion"
                        name="fraccion"
                        options={fracciones}
                        getOptionLabel={option => option.fraccion}
                        sx={{ gridColumn: "span 4" }}
                        onChange={(e, value) => {
                            setFraccionSeleccionado(value);
                        }}
                        renderInput={params => (
                            <TextField
                                label="Seleccion la fracción"
                                fullWidth
                                variant="filled"
                                type="text"
                                name="fraccion"
                                color="secondary"
                                {...params}
                            />
                        )}
                    />
                </Box>
            </Grid>
            <Grid item md={6}>
                <CotaForm/>
            </Grid>
            <Grid item md={6}>
                <CotaTable/>
            </Grid>
        </Grid>

    );
};

export default CotaTab;
