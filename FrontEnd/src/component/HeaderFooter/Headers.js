import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import "./Headers.css";
import ToolbarControl from "./ToolbarControl";
import MenuLink from "./MenuLink";
import SearchBar from "./SearchBar";

const handleLogoClick = () => {
  window.location.href = "/";
};

function ResponsiveAppBar() {
  return (
    <AppBar position="static" className="navbar-main">
      <Container
        className="main-nav"
        maxWidth="xl"
        sx={{
          backgroundColor: "white",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{ position: "relative" }}
          className="sub-nav"
          disableGutters
        >
          <Box className="Logo" sx={{ width: 200 }}>
            <img src="/Logo.png" alt="Logo" onClick={handleLogoClick} />
          </Box>
          <MenuLink />
          <SearchBar />
          <ToolbarControl />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
