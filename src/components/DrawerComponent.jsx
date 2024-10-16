// components/DrawerComponent.js
import React from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "flex-end",
}));

const Pages = [
  { path: "/", name: "MyDay" },
  { path: "/important", name: "Important" },
  { path: "/planned", name: "Planned" },
  { path: "/assigned_to_me", name: "AssignedToMe" },
  { path: "/tasks", name: "Tasks" },
];

function DrawerComponent({ open, handleDrawerClose }) {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          marginTop: "64px", // Push the drawer below the AppBar
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <List>
        {Pages.map((page) => (
          <ListItem key={page.path} disablePadding>
            <ListItemButton component={NavLink} to={page.path}>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default DrawerComponent;
