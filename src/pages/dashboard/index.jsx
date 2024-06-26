import {Box, Button, FormControl, IconButton, InputLabel, Select, Typography, useTheme} from "@mui/material";
import { tokens } from "../../theme.jsx";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {setLoader} from "../../store/slices/generalSlice.js";
import {getIndicadores} from "../../store/slices/operacionSlice.js";
import {TiposIndicadores} from "../../utils/constantes.js";
import indicadoresCommons from "../../utils/indicadoresCommons.js";
import {AccountTree as AccountTreeIcon, LanOutlined, Microsoft, Api as ApiIcon, Description as DescriptionIcon} from "@mui/icons-material";
import BarCostosChart from "../../components/BarCostosChart.jsx";
import MenuItem from "@mui/material/MenuItem";
import {DatePicker} from "@mui/x-date-pickers";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import moment from "moment";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const operaciones = useSelector(state => state.operaciones.operaciones);
  const indicadores = useSelector(state => state.operaciones.indicadores);
  const [totalCosto, setTotalCosto] = useState(0.00);
  const [totalOperaciones, setTotalOperaciones] = useState(0.00);

  useEffect(() => {
    dispatch(setLoader(true));
    dispatch(getIndicadores({tipoindicador: TiposIndicadores.POR_TODOS}))
        .then(resp => {
          dispatch(setLoader(false));
        })
  }, []);

  useEffect(() => {

    setTotalCosto(indicadoresCommons.totalCosto(indicadores));
    setTotalOperaciones(indicadoresCommons.totalOperaciones(indicadores));

  }, [indicadores]);

  const indicador = (tipoEntidad, tipoOperacion) => indicadores.find(i => i.tipoEntidad === tipoEntidad && i.tipoOperacion === tipoOperacion);

  const porcentajeOperacion = (tipoEntidad, tipoOperacion) => {
    let existeInd = indicadores.find(i => i.tipoEntidad === tipoEntidad && i.tipoOperacion === tipoOperacion);
    let porcentaje = 0;
    if(existeInd){
      porcentaje = ((existeInd.cantOperaciones * 100) / totalOperaciones).toFixed(2);
    }

    return porcentaje;

  }


  return (
      <Box m="20px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="DASHBOARD" subtitle="Bienvenido al dashboard" />

          <Box gap="10px" display="grid" gridTemplateColumns="repeat(3, 1fr)">
            <DatePicker
                defaultValue={moment().subtract(1, 'week')}
                label="Fecha inicio"
                slotProps={{
                  openPickerIcon: { fontSize: 'large' },
                  openPickerButton: { color: 'secondary' },
                  textField: {
                    variant: 'filled',
                    color: 'secondary',
                    size: 'small'
                  },
                }} />

            <DatePicker
                defaultValue={moment()}
                label="Fecha fin"
                slotProps={{
                  openPickerIcon: { fontSize: 'large' },
                  openPickerButton: { color: 'secondary' },
                  textField: {
                    variant: 'filled',
                    color: 'secondary',
                    size: 'small'
                  },
                }} />
            <Button
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
                variant="contained"
            >
              <AutorenewIcon sx={{ mr: "10px" }} />
              Actualizar
            </Button>
          </Box>
        </Box>

        {/* GRID & CHARTS */}
        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
        >
          {/* ROW 1 */}
          <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
          >
            {
                indicadores.length > 0 && <StatBox
                    title={indicador("PROYECTO", "CREATE").cantOperaciones}
                    subtitle="Proyectos creados"
                    progress={porcentajeOperacion("PROYECTO", "CREATE") / 100}
                    increase={`${porcentajeOperacion("PROYECTO", "CREATE")}%`}
                    icon={
                      <AccountTreeIcon
                          sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                      />
                    }
                />
            }
          </Box>
          <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
          >
            {
                indicadores.length > 0 &&<StatBox
                    title={indicador("UNIDAD", "CREATE").cantOperaciones}
                    subtitle="unidades creadas"
                    progress={porcentajeOperacion("unidad", "CREATE") / 100}
                    increase={`${porcentajeOperacion("unidad", "CREATE")}%`}
                    icon={
                      <Microsoft
                          sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                      />
                    }
                />}
          </Box>
          <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
          >
            {
                indicadores.length > 0 &&<StatBox
                    title={indicador("COTA", "CREATE").cantOperaciones}
                    subtitle="Cotas creadas"
                    progress={porcentajeOperacion("COTA", "CREATE") / 100}
                    increase={`${porcentajeOperacion("COTA", "CREATE")}%`}
                    icon={
                      <ApiIcon
                          sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                      />
                    }
                />}
          </Box>
          <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
          >
            {
                indicadores.length > 0 && <StatBox
                    title={indicador("DOCUMENTO_UNIDADES", "GENERATE").cantOperaciones}
                    subtitle="Documento"
                    progress={porcentajeOperacion("DOCUMENTO_UNIDADES", "GENERATE") / 100}
                    increase={`${porcentajeOperacion("DOCUMENTO_UNIDADES", "GENERATE")}%`}
                    icon={
                      <DescriptionIcon
                          sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                      />
                    }
                />}
          </Box>

          {/* ROW 2 */}
          <Box
              gridColumn="span 8"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
          >
            <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
            >
              <Box>
                <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                >
                  Operaciones generadas
                </Typography>
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                >
                  {totalOperaciones}
                </Typography>
              </Box>
            </Box>
            <Box height="250px" m="-20px 30px 0 0">
              <LineChart isDashboard={true} />
            </Box>
          </Box>
          <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              overflow="auto"
          >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
            >
              <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                Operaciones recientes
              </Typography>
            </Box>
            {mockTransactions.map((transaction, i) => (
                <Box
                    key={`${transaction.txId}-${i}`}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`4px solid ${colors.primary[500]}`}
                    p="15px"
                >
                  <Box>
                    <Typography
                        color={colors.greenAccent[500]}
                        variant="h5"
                        fontWeight="600"
                    >
                      {transaction.txId}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {transaction.user}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{transaction.date}</Box>
                  <Box
                      backgroundColor={colors.greenAccent[500]}
                      p="5px 10px"
                      borderRadius="4px"
                  >
                    ${transaction.cost}
                  </Box>
                </Box>
            ))}
          </Box>

          {/* ROW 3 */}
          <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              p="30px"
          >
            <Typography variant="h5" fontWeight="600">
              Operaciones
            </Typography>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt="25px"
            >
              <ProgressCircle size="125" />
              <Typography
                  variant="h5"
                  color={colors.greenAccent[500]}
                  sx={{ mt: "15px" }}
              >
                $48,352 Mxn por operación
              </Typography>
              <Typography>Total histórico</Typography>
            </Box>
          </Box>
          <Box
              gridColumn="span 8"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
          >
            <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
            >
              <Box>
                <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                >
                  Costo por entidades y operaciones
                </Typography>
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                >
                  {totalCosto}
                </Typography>
              </Box>
            </Box>
            <Box height="250px" mt="-20px">
              <BarCostosChart isDashboard={false} />
            </Box>
          </Box>
          {/*<Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              padding="30px"
          >
            <Typography
                variant="h5"
                fontWeight="600"
                sx={{ marginBottom: "15px" }}
            >
              Geography Based Traffic
            </Typography>
            <Box height="200px">
              <GeographyChart isDashboard={true} />
            </Box>
          </Box>*/}
        </Box>
      </Box>
  );
};

export default Dashboard;
