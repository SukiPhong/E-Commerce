import React, { useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Avatar from "@mui/material/Avatar";
import { IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FavoriteProductsMenu from "../Popover-Menu/FavoriteProductsMenu";
import ShoppingCartMenu from "../Popover-Menu/ShoppingCartMenu";
import {
  selectAdmin,
  selectIsLoggedIn,
  setLogout,
} from "../../service/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Headers.css";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { getUserFavorites, getAvatar, getCart } from "../../service/api";
import { selectAccessToken } from "../../service/userSlice";
import useForceUpdate from "../../service/forceUpdate";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: `1px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    color: "white",
    backgroundColor: "red",
  },
}));

const ToolbarControl = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [favoriteMenuOpen, setFavoriteMenuOpen] = useState(false);
  const [shoppingCartMenuOpen, setShoppingCartMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin = useSelector(selectAdmin);
  const accessToken = useSelector(selectAccessToken);
  const [badgeFavorites, setBadgeFavorites] = useState([]);
  const [badgeCart, setBadgeCart] = useState([]);
  const forceUpdate = useForceUpdate();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const favorites = await getUserFavorites(accessToken);
        const userAvatar = await getAvatar(accessToken);
        const shoppingCart = await getCart(accessToken);

        if (isMounted) {
          setAvatar(userAvatar);
          setBadgeFavorites(favorites);
          setBadgeCart(shoppingCart);
          forceUpdate();
        }
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
      }
    };

    if (accessToken) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, dispatch, forceUpdate]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleFavoriteIconMouseEnter = () => {
    setFavoriteMenuOpen(true);
  };

  const handleFavoriteIconMouseLeave = () => {
    setFavoriteMenuOpen(false);
  };

  const handleShoppingCartIconMouseEnter = () => {
    setShoppingCartMenuOpen(true);
  };

  const handleShoppingCartIconMouseLeave = () => {
    setShoppingCartMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    window.location.pathname = "/login-register";
  };

  return (
    <div
      className="toolbar-control"
      style={{ flexGrow: 0, marginLeft: "10px" }}
    >
      <Link
        className="shoppingcart-hover"
        to="/giohang"
        onMouseEnter={handleShoppingCartIconMouseEnter}
        onMouseLeave={handleShoppingCartIconMouseLeave}
      >
        <IconButton>
          <StyledBadge badgeContent={badgeCart?.length}>
            <ShoppingCartOutlinedIcon fontSize="large" />
          </StyledBadge>
        </IconButton>
        {shoppingCartMenuOpen && <ShoppingCartMenu />}
      </Link>

      <Link to="/thongbao">
        <IconButton>
          <NotificationsNoneOutlinedIcon fontSize="large" />
        </IconButton>
      </Link>

      <Link
        className="heart-hover"
        to="/thongtin/yeuthich"
        onMouseEnter={handleFavoriteIconMouseEnter}
        onMouseLeave={handleFavoriteIconMouseLeave}
      >
        <IconButton>
          <StyledBadge badgeContent={badgeFavorites.length}>
            <FavoriteBorderIcon fontSize="large" />
          </StyledBadge>
        </IconButton>
        {favoriteMenuOpen && <FavoriteProductsMenu />}
      </Link>

      <Tooltip title="Tài khoản">
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{ p: 0, marginLeft: "10px" }}
        >
          <Avatar alt="" src={avatar} sx={{ border: "2px solid black" }} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleCloseUserMenu} className="menu-item">
          {!isLoggedIn ? (
            <Link className="link-item" to="/login-register">
              <Typography
                className="setting-item"
                sx={{
                  textDecoration: "none",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  color: "black",
                }}
                textAlign="center"
              >
                ĐĂNG NHẬP
              </Typography>
            </Link>
          ) : (
            <>
              {!isAdmin ? (
                <>
                  <Link className="link-item" to="/thongtin">
                    <Typography
                      className="setting-item"
                      sx={{
                        textDecoration: "none",
                        textTransform: "uppercase",
                        color: "black",
                        fontWeight: "bold",
                      }}
                      textAlign="center"
                    >
                      THÔNG TIN
                    </Typography>
                  </Link>
                  <Link className="link-item" to="/thongtin/lichsumuahang">
                    <Typography
                      className="setting-item"
                      sx={{
                        textDecoration: "none",
                        textTransform: "uppercase",
                        color: "black",
                        fontWeight: "bold",
                      }}
                      textAlign="center"
                    >
                      ĐƠN MUA
                    </Typography>
                  </Link>
                </>
              ) : (
                <Link className="link-item" to="/admin-dashbar">
                  <Typography
                    className="setting-item"
                    sx={{
                      textDecoration: "none",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color: "black",
                    }}
                    textAlign="center"
                  >
                    QUẢN LÝ
                  </Typography>
                </Link>
              )}
              <Link className="link-item" onClick={handleLogout}>
                <Typography
                  className="setting-item"
                  sx={{
                    textDecoration: "none",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  textAlign="center"
                >
                  ĐĂNG XUẤT
                </Typography>
              </Link>
            </>
          )}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ToolbarControl;
