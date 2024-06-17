import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useState} from "react";
import {Grid, Paper, useTheme} from "@mui/material";
import {tokens} from "../../theme.jsx";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PreviewFile = ({urlFile}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    //const [open, setOpen] = useState(false);
    //const handleOpen = () => setOpen(true);

    return (
        <Grid container>

            {
                !urlFile && (
                    <Grid item md={12}>
                        <Paper sx={{ width: '100%', height: 720, display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            backgroundColor: `${colors.grey[600]}`,
                            backgroundImage: `none`
                        }}>
                            <Typography align="center" variant="h1" gutterBottom>
                                VISTA PREVIA
                            </Typography>
                            <Typography align="center" variant="h1" gutterBottom>
                                NO DISPONIBLE
                            </Typography>
                            <VisibilityOffIcon sx={{ fontSize: 50 }} />

                        </Paper>
                    </Grid>
                )
            }
            {
                urlFile && (
                    <Grid item md={12}>
                        <iframe className="pdf"
                                src={urlFile}
                                width="100%" height="720">
                        </iframe>
                    </Grid>
                )
            }

        </Grid>
    );
}

export default PreviewFile;