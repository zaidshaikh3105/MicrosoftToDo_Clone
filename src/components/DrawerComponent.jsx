// components/DrawerComponent.js
import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";

import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
const drawerWidth = 300;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
}));

const Pages = [
  { path: "/", name: "MyDay" },
  { path: "/do-First", name: "Do First" },
  { path: "/schedule", name: "Schedule" },
  { path: "/delegate", name: "Delegate" },
  { path: "/dontdo", name: "Don’t Do" },
];

function DrawerComponent() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  // Function to close the drawer
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const [value, setValue] = React.useState(0);

  return (
    <>
      <IconButton onClick={handleDrawerOpen}>
        <RxHamburgerMenu />
      </IconButton>
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
        open={drawerOpen}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <RxHamburgerMenu />
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
        <Box>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
          </BottomNavigation>
        </Box>
      </Drawer>
    </>
  );
}

export default DrawerComponent;
