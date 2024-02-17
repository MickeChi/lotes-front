import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme.jsx";
import { mockLineData as data } from "../data/mockData";
import {useEffect, useState} from "react";
import OperacionService from "../services/OperacionService.js";
import {TiposIndicadores} from "../utils/constantes.js";
import {setLoader} from "../store/slices/generalSlice.js";
import {useDispatch, useSelector} from "react-redux";
import indicadoresCommons from "../utils/indicadoresCommons.js";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [datosGrafica, setDatosGrafica] = useState([]);
  const indicadores = useSelector(state => state.operaciones.indicadores);

  const colorsLines = [
    tokens("dark").blueAccent[300],
    tokens("dark").greenAccent[500],
    tokens("dark").redAccent[200],
    tokens("dark").primary[200]
  ];

  useEffect(() => {

    let datos = indicadoresCommons.datosLineChartOperaciones(indicadores).map((ind, index ) => {
      ind.color = colorsLines[index];
      return ind;
    });

    setDatosGrafica(datos);
    console.log("indicadores dataLine: ", datos);

  }, [indicadores]);

  return (
      <ResponsiveLine
          data={datosGrafica}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.grey[100],
                },
              },
              legend: {
                text: {
                  fill: colors.grey[100],
                },
              },
              ticks: {
                line: {
                  stroke: colors.grey[100],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.grey[100],
                },
              },
            },
            legends: {
              text: {
                fill: colors.grey[100],
              },
            },
            tooltip: {
              container: {
                color: colors.primary[500],
              },
            },
          }}
          colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
          margin={{ top: 50, right: 120, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          curve="catmullRom"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : "transportation", // added
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickValues: 5, // added
            tickSize: 3,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? "Cant. Operaciones" : undefined , // added
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enableGridY={false}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
      />
  );
};

export default LineChart;
