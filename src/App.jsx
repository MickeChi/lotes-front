import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import {MSidebarProvider} from "./scenes/global/MSidebarProvider.jsx";

import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import Proyectos from "./scenes/proyectos/index.jsx";
import Usuarios from "./scenes/Usuarios";
import ProyectoCreatePage from "./scenes/proyectos/ProyectoCreatePage.jsx";
import ProyectoShowPage from "./scenes/proyectos/ProyectoShowPage.jsx";

function App() {
  const [theme, colorMode] = useMode();
  //const [isSidebar, setIsSidebar] = useState(true);

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MSidebarProvider>
            <div style={{ height: "100%", width: "100%" }} >
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
  );
}

export default App;
