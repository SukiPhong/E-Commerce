import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import axios from "axios";

const MenuLink = () => {
  const [categories, setCategories] = useState([]);
  const [anchorCollection, setAnchorCollection] = React.useState(null);

  const handleOpenCollectionMenu = (event) => {
    setAnchorCollection(event.currentTarget);
  };

  const handleCloseCollectionMenu = () => {
    setAnchorCollection(null);
  };
  useEffect(() => {
    axios
      .get("http://localhost:8000/Category")
      .then((response) => {
        setCategories(response.data.prodCategory);
      })
      .catch((error) => {
        console.error("Lỗi trong quá trình gọi API danh mục:", error);
      });
  }, []);

  return (
    <Box
      className="menu-link"
      sx={{
        flexGrow: 1,
        display: { xs: "none", md: "flex" },
      }}
    >
      <Link
        sx={{ my: 2, display: "block", width: "12rem" }}
        className="buttonPage"
        to="/"
      >
        <p className="linkPage">TRANG CHỦ</p>
      </Link>
      <Link
        className="buttonPage"
        sx={{ my: 2, display: "block", width: "12rem" }}
        to="/sanpham"
      >
        <p className="linkPage">SẢN PHẨM</p>
      </Link>
      <Link
        className="buttonPage"
        sx={{ my: 2, display: "block", width: "12rem" }}
        to="/magiamgiashop"
      >
        <p className="linkPage">MÃ GIẢM GIÁ</p>
      </Link>
      <Tooltip>
        <>
          <Button onClick={handleOpenCollectionMenu} className="buttonPage">
            <p
              style={{ margin: "0 0 0 5px", textAlign: "center" }}
              className="linkPage"
            >
              BỘ SƯU TẬP
            </p>
          </Button>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorCollection}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorCollection)}
            onClose={handleCloseCollectionMenu}
          >
            <MenuItem onClick={handleCloseCollectionMenu} className="menu-item">
              {categories.map((category) => (
                <Link
                  key={category.categoryName}
                  className="link-item"
                  to={`/sanpham/danhmucsanpham/${category._id}`}
                >
                  <Typography
                    key={category._id}
                    className="setting-item"
                    sx={{
                      textDecoration: "none",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color: "black",
                    }}
                    textAlign="center"
                  >
                    {category.categoryName}
                  </Typography>
                </Link>
              ))}
            </MenuItem>
          </Menu>
        </>
      </Tooltip>
    </Box>
  );
};

export default MenuLink;
