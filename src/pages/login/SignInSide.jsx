import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useDispatch} from "react-redux";
import {setLoader} from "../../store/slices/generalSlice.js";
import {Formik} from "formik";
import {Autocomplete} from "@mui/material";
import * as yup from "yup";
import {useState} from "react";
import {useNavigate} from "react-router-dom";


const Copyright = (props) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link target="_blank" color="inherit" href="https://icodemex.com">
                icodemex
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const initialValues = {
    email:"",
    password:"",
};

const SignInSide = () => {
    const dispatch = useDispatch();
    const [formState, setFormState] = useState(initialValues);
    const navigate = useNavigate();


    const handleSubmit = (values) => {
        //const data = new FormData(event.currentTarget);
        const valuesRequest = {...values};
        console.log("valuesRequest: ", valuesRequest);

        dispatch(setLoader(true));

        setTimeout(() => {
            console.log("Delayed for 2 second.");
            dispatch(setLoader(false));
            navigate("/dashboard");

        }, "2000");

    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Iniciar sesión
                        </Typography>


                        <Formik
                            onSubmit={handleSubmit}
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
                                  handleSubmit
                              }) => (
                                <form onSubmit={handleSubmit}>


                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        error={!!touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                        //color="secondary"
                                        sx={{ gridColumn: "span 12" }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        color="secondary"
                                        error={!!touched.password && !!errors.password}
                                        helperText={touched.password && errors.password}
                                        sx={{ gridColumn: "span 12" }}
                                    />
                                    <Button type="submit" fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}>
                                        Ingresar
                                    </Button>
                                </form>
                            )}
                        </Formik>

                        {/*<FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />*/}
                        {/*<Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>*/}
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

const checkoutSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required")
});

export default SignInSide;