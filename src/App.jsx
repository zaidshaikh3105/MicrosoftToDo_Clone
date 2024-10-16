import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Appbar from "./components/Appbar";
import DrawerComponent from "./components/DrawerComponent";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerClose = () => {
    setDrawerOpen(true);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  // Define the theme inline
  const theme = createTheme({
    palette: {
      primary: {
        main: "#0078d4",
      },
      secondary: {
        main: "#ffffff",
      },
      background: {
        default: "#f3f2f1",
      },
      text: {
        primary: "#323130",
        secondary: "#605e5c",
      },
    },
    typography: {
      fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
      h6: {
        fontWeight: 600,
      },
      body1: {
        fontSize: "1rem",
        color: "#323130",
      },
      button: {
        textTransform: "none",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Appbar */}
        <Appbar />

        {/* Drawer */}
        <DrawerComponent
          open={drawerOpen}
          handleDrawerClose={handleDrawerClose}
        />

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: "64px",
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
