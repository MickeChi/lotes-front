import {Routes, Route, HashRouter} from "react-router-dom";
import {Backdrop, CircularProgress, CssBaseline, ThemeProvider} from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import {MSidebarProvider} from "./pages/global/MSidebarProvider.jsx";

import Topbar from "./pages/global/Topbar";
import Dashboard from "./pages/dashboard";
import Reportes from "./pages/reportes";
import Contacts from "./pages/empresa";
import Form from "./pages/form";
import Proyectos from "./pages/proyectos/index";
import Usuarios from "./pages/Usuarios";
import ProyectoCreatePage from "./pages/proyectos/ProyectoCreatePage";
import ProyectoShowPage from "./pages/proyectos/ProyectoShowPage";
import {useSelector} from "react-redux";
import SignInSide from "./pages/login/SignInSide";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";

function App() {
  const [theme, colorMode] = useMode();
  const loader = useSelector(state => state.general.loader);

  //Temporal para pintar el login
  let pathName = window.location.hash;
  let arr = pathName.toString().split("/");
  let currentPath = arr[arr.length-1];

  return (
      <HashRouter>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <CssBaseline/>
              <div style={{display: "flex", flexDirection: "row"}}>
                {currentPath.length > 0 && <MSidebarProvider/>}
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={loader}
                >
                  <CircularProgress color="inherit"/>
                </Backdrop>
                <main style={{width: "100%"}}>
                  {currentPath.length > 0 && <Topbar/>}
                  <Routes>
                    <Route path="/" element={<SignInSide/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/proyectos" element={<Proyectos/>}/>
                    <Route path="/proyectos/create" element={<ProyectoCreatePage/>}/>
                    <Route path="/proyectos/show/:proyectoId" element={<ProyectoShowPage/>}/>
                    <Route path="/usuarios" element={<Usuarios/>}/>
                    <Route path="/empresas" element={<Contacts/>}/>
                    <Route path="/reportes" element={<Reportes/>}/>
                    <Route path="/form" element={<Form/>}/>
                  </Routes>
                </main>
              </div>
            </LocalizationProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </HashRouter>
  );
}

export default App;
