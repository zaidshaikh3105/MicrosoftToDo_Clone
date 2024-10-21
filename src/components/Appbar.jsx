import React from "react";
import {
  InputAdornment,
  AppBar,
  TextField,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { IoApps } from "react-icons/io5";
import SearchIcon from "@mui/icons-material/Search";
import { VscSearch } from "react-icons/vsc";

function Appbar() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton sx={{ mr: 2, color: "white" }}>
          <IoApps />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          To Do
        </Typography>
        <Box
          sx={{
            color: "primary",
            flexGrow: 15,
            display: "flex",
            justifyContent: "center",
            borderRadius: 1,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ width: "50%", bgcolor: "white", borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VscSearch color="#0078d4" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
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
