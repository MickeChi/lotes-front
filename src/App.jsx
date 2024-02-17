import {Routes, Route, BrowserRouter, HashRouter} from "react-router-dom";
import {Backdrop, CircularProgress, CssBaseline, ThemeProvider} from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import {MSidebarProvider} from "./pages/global/MSidebarProvider.jsx";

import Topbar from "./pages/global/Topbar";
import Dashboard from "./pages/dashboard";
import Invoices from "./pages/invoices";
import Contacts from "./pages/contacts";
import Form from "./pages/form";
import Proyectos from "./pages/proyectos/index.jsx";
import Usuarios from "./pages/Usuarios";
import ProyectoCreatePage from "./pages/proyectos/ProyectoCreatePage.jsx";
import ProyectoShowPage from "./pages/proyectos/ProyectoShowPage.jsx";
import {useSelector} from "react-redux";

function App() {
  const [theme, colorMode] = useMode();
  const loader = useSelector(state => state.general.loader);

  //const [isSidebar, setIsSidebar] = useState(true);

  return (
      <HashRouter>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MSidebarProvider>
              <div style={{ height: "100%", width: "100%" }} >
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loader}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
                <main >
                  <Topbar/>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/proyectos" element={<Proyectos />} />
                    <Route path="/proyectos/create" element={<ProyectoCreatePage />} />
                    <Route path="/proyectos/show/:proyectoId" element={<ProyectoShowPage />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/form" element={<Form />} />
                    {/*<Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/geography" element={<Geography />} />*/}
                  </Routes>
                </main>
              </div>
            </MSidebarProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </HashRouter>
  );
}

export default App;
