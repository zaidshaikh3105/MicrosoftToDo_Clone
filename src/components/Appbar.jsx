import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Avatar } from "@mui/material";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
function Appbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0078d4" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <AppRegistrationRoundedIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Segoe UI, sans-serif" }}
        >
          ToDo
        </Typography>

        <Avatar
          alt="User Avatar"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          sx={{ width: 40, height: 40 }}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;
