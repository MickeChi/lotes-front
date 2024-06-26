import { useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";

import { useSidebarContext } from "./MSidebarProvider";

import { Link } from "react-router-dom";
import { tokens } from "../../theme.jsx";
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";

import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import {Business, LanOutlined} from "@mui/icons-material";
import imgAvatar from '../../assets/usuario2.jpg';
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
      <MenuItem
          active={selected === title}
          style={{ color: colors.grey[100] }}
          onClick={() => setSelected(title)}
          icon={icon}
          component={<Link to={to} />}
      >
        <Typography>{title}</Typography>
      </MenuItem>
  );
};

const MSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { sidebarRTL, sidebarImage } = useSidebarContext();
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();
  return (
      <Box
          sx={{
            position: "sticky",
            display: "flex",
            height: "100vh",
            top: 0,
            bottom: 0,
            zIndex: 100,
            "& .ps-sidebar-root": {
              border: "none",
            },
            "& .ps-menu-icon": {
              backgroundColor: "transparent !important",
            },
            "& .ps-menu-button": {
              // padding: "5px 35px 5px 20px !important",
              backgroundColor: "transparent !important",
            },
            "& .ps-menu-anchor": {
              color: "inherit !important",
              backgroundColor: "transparent !important",
            },
            "& .ps-menu-button:hover": {
              color: `${colors.blueAccent[500]} !important`,
              backgroundColor: "transparent !important",
            },
            "& .ps-menu-button.ps-active": {
              //color: `${colors.greenAccent[500]} !important`,
                color: `${colors.blueAccent[500]} !important`,
              backgroundColor: "transparent !important",
            },
          }}
      >
        <Sidebar
            breakPoint="md"
            rtl={sidebarRTL}
            backgroundColor={colors.primary[400]}
            image={sidebarImage}
        >
          <Menu iconshape="square">
            <MenuItem
                icon={
                  collapsed ? (
                      <MenuOutlinedIcon onClick={() => collapseSidebar()} />
                  ) : undefined
                }
                style={{
                  margin: "10px 0 20px 0",
                  color: colors.grey[100],
                }}
            >
              {!collapsed && (
                  <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      ml="15px"
                  >
                    <Typography variant="h3" color={colors.grey[100]}>
                      DESCRIPTIVOS
                    </Typography>
                    <IconButton
                        onClick={
                          broken ? () => toggleSidebar() : () => collapseSidebar()
                        }
                    >
                        <MenuOutlinedIcon />

                    </IconButton>
                  </Box>
              )}
            </MenuItem>
            {!collapsed && (
                <Box mb="25px">
                  <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        "& .avater-image": {
                          backgroundColor: colors.primary[500],
                        },
                      }}
                  >
                    <img
                        className="avater-image"
                        alt="profile user"
                        width="100px"
                        height="100px"
                        src={imgAvatar}
                        style={{ cursor: "pointer", borderRadius: "50%" }}
                    />
                  </Box>
                  <Box textAlign="center">
                    <Typography
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ m: "10px 0 0 0" }}
                    >
                        José María
                    </Typography>
                      <Typography variant="h5" color={colors.greenAccent[500]}>
                          Notaría 47
                      </Typography>
                  </Box>
                </Box>
            )}
            <Box paddingLeft={collapsed ? undefined : "10%"}>
              <Item
                  title="Dashboard"
                  to="/dashboard"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

                <Item
                    title="Proyectos"
                    to="/proyectos"
                    icon={<LanOutlined />}
                    selected={selected}
                    setSelected={setSelected}
                />

              <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 20px 5px 20px" }}
              >
                Administración
              </Typography>
              <Item
                  title="Usuarios"
                  to="/usuarios"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="Empresas"
                  to="/empresas"
                  icon={<Business />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="Reportes"
                  to="/reportes"
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
                {/*
              <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 20px 5px 20px" }}
              >
                Pages
              </Typography>

              <Item
                  title="Calendar"
                  to="/calendar"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="FAQ Page"
                  to="/faq"
                  icon={<HelpOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 20px 5px 20px" }}
              >
                Charts
              </Typography>
              <Item
                  title="Bar Chart"
                  to="/bar"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="Pie Chart"
                  to="/pie"
                  icon={<PieChartOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="Line Chart"
                  to="/line"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="Geography Chart"
                  to="/geography"
                  icon={<MapOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              /> */}
            </Box>
          </Menu>
        </Sidebar>
      </Box>
  );
};

export default MSidebar;
