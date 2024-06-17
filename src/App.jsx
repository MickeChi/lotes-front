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
import {useDispatch, useSelector} from "react-redux";
import SignInSide from "./pages/login/SignInSide";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {EstatusArchivos, IdbProps} from "./utils/constantes.js";
import {useEffect} from "react";
import {setRunWebWorkerFiles, setInfoWebWorkerFiles, setLoader} from "./store/slices/generalSlice.js";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function App() {
  const [theme, colorMode] = useMode();
  const dispatch = useDispatch();
  const loader = useSelector(state => state.general.loader);
  const runWebWorkerFiles =  useSelector(state => state.general.runWebWorkerFiles);
  const infoWebWorkerFiles =  useSelector(state => state.general.infoWebWorkerFiles);


  //Temporal para pintar el login
  let pathName = window.location.hash;
  let arr = pathName.toString().split("/");
  let currentPath = arr[arr.length-1];

  useEffect(() => {
    if(runWebWorkerFiles){
      console.log("Ejecutando Web worker...");
      uploadFilesWorker();
    }
  }, [runWebWorkerFiles]);
  const uploadFilesWorker = () => {
    if (window.Worker) {
      const myWorker = new Worker("filesWorker.js");

      let filesInfo = {
        ...infoWebWorkerFiles,
        accion: EstatusArchivos.CARGA_ARCHIVOS_INIT,
        ...IdbProps
      };
      console.log('Message posted to worker: ', filesInfo);
      myWorker.postMessage(filesInfo);

      myWorker.onmessage = function (e) {
        e.data.accion = EstatusArchivos.CARGA_ARCHIVOS_FIN;
        e.data.cantidadArchivos = e.data.uploadResults.length;
        console.log('Message received from worker: ', e.data);
        delete e.data.uploadResults;

        dispatch(setInfoWebWorkerFiles(e.data));
        dispatch(setRunWebWorkerFiles(false));

        withReactContent(Swal).fire({
          title: `Se finalizó la carga de ${e.data.cantidadArchivos} archivos`,
          icon: "success"
        })

      }

    } else {
      console.log('Your browser doesn\'t support web workers.');
    }

  }

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
