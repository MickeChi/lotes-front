import {Box, Button, Card, CardActions, CardContent, CardMedia, Typography, useTheme} from "@mui/material";
import {CreateNewFolderOutlined, FolderSpecial, FolderSpecialRounded} from "@mui/icons-material";
import {tokens} from "../../theme.jsx";
import {useState} from "react";
import {Link} from "react-router-dom";


const ProyectoCard = ({proy}) =>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [proyinfo, setProyinfo] = useState(proy)
    return (
        <Box gridColumn="span 3" >
            <Card sx={{
                backgroundColor: `${colors.primary[400]}`,
                backgroundImage: `none`
            }}>

                <CardContent sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    <FolderSpecial sx={{ fontSize: 100 }} />
                    <Typography
                        variant="h4"
                        color={colors.greenAccent[500]}
                    >
                        {proyinfo.titulo}
                    </Typography>
                    <Typography variant="h6" fontWeight="600" sx={{ mt: "15px" }}>
                        - Ubicación: {proyinfo.municipio + ', ' +proyinfo.estado} <br/>
                        - Total unidades: {proyinfo.totalUnidades} <br/>
                        - Uso: {proyinfo.uso} <br/>
                        - Clase: {proyinfo.clase} <br/>
                    </Typography>
                </CardContent>
                <CardActions sx={{
                                 alignSelf: "stretch",
                                 display: "flex",
                                 justifyContent: "flex-end",
                                 alignItems: "flex-start",
                             }}>

                    <Link to={`/proyectos/show/${proyinfo.id}`}>
                        <Button size="medium" color="secondary" variant="contained">Ver</Button>
                    </Link>
                </CardActions>
            </Card>
        </Box>
    )
}

export default ProyectoCard;