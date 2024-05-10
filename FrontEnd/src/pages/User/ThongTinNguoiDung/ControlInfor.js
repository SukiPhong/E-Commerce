import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./ThongTinNguoiDung.css";
import Loading from "../../../component/Loading/Loading";
import "./ControlInfor.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HistoryIcon from "@mui/icons-material/History";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken } from "../../../service/userSlice";
import axios from "axios";
import CustomSnackbar from "../../../component/Snakbar/CustomSnackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const ControlInfor = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [Avatar, setNewAvartar] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);
  const [openSnackBar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [messageServerity, setMessageServerity] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user/current", {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        });
        setNewAvartar(res.data.user.Avatar);
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken, dispatch]);

  const handleAvatarChange = async (e) => {
    setIsSaving(true);
    setOpenBackdrop(true);

    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("Avatar", file);

      try {
        const response = await axios.put(
          "http://localhost:8000/user/update/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              token: `Bearer ${accessToken}`,
            },
          }
        );

        setNewAvartar(response.data.user.Avatar);
        handleOpenSnackbar("CẬP NHẬT ẢNH ĐẠI DIỆN THÀNH CÔNG", "info");
      } catch (error) {
        console.error("Error while calling API:", error);
      } finally {
        setIsSaving(false);
        setOpenBackdrop(false);
      }
    } else setOpenBackdrop(false);
  };

  const handleOpenSnackbar = (message, severity) => {
    setMessage(message);
    setMessageServerity(severity);
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [location.pathname]);
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="control-infor">
      <div className="avatar-user">
        <img src={Avatar} alt="" onClick={handleOpen} />
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
          id="avatar-upload"
        />
        <label htmlFor="avatar-upload" className="btn-change-img">
          {isSaving ? "Đang thay đổi..." : "Thay đổi ảnh đại diện"}
        </label>
      </div>
      <div className="btn-control-content">
        <Link
          className={
            location.pathname === "/thongtin"
              ? "btnControl active"
              : "btnControl"
          }
          to="/thongtin"
        >
          <AccountCircleIcon sx={{ fontSize: 35, color: "#ee4d2d" }} />
          <p>Hồ Sơ Của Tôi</p>
        </Link>
        <Link
          className={
            location.pathname === "/thongtin/diachi"
              ? "btnControl active"
              : "btnControl"
          }
          to="/thongtin/diachi"
        >
          <LocationOnIcon sx={{ fontSize: 35, color: "#ee4d2d" }} />
          <p>Địa Chỉ</p>
        </Link>
        <Link
          className={
            location.pathname === "/thongtin/lichsumuahang"
              ? "btnControl active"
              : "btnControl"
          }
          to="/thongtin/lichsumuahang"
        >
          <HistoryIcon sx={{ fontSize: 35, color: "#ee4d2d" }} />
          <p>Lịch Sử Mua Hàng</p>
        </Link>
        <Link
          className={
            location.pathname === "/thongtin/voucher"
              ? "btnControl active"
              : "btnControl"
          }
          to="/thongtin/voucher"
        >
          <ConfirmationNumberIcon sx={{ fontSize: 35, color: "#ee4d2d" }} />
          <p>Kho Voucher</p>
        </Link>
        <Link
          className={
            location.pathname === "/thongtin/thongbao"
              ? "btnControl active"
              : "btnControl"
          }
          to="/thongtin/thongbao"
        >
          <CircleNotificationsIcon sx={{ fontSize: 35, color: "#ee4d2d" }} />
          <p>Thông Báo</p>
        </Link>
        <Link
          className={
            location.pathname === "/thongtin/yeuthich"
              ? "btnControl active"
              : "btnControl"
          }
          to="/thongtin/yeuthich"
        >
          <FavoriteIcon sx={{ fontSize: 35, color: "#ee4d2d" }} />
          <p>Sản Phẩm Yêu Thích</p>
        </Link>
        <Link
          className={
            location.pathname === "/thongtin/doimatkhau"
              ? "btnControl active"
              : "btnControl"
          }
          to="/thongtin/doimatkhau"
        >
          <LockIcon sx={{ fontSize: 35, color: "#ee4d2d" }} />
          <p>Đổi Mật Khẩu</p>
        </Link>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="avatar-modal">
          <img src={Avatar} alt="" />
        </Box>
      </Modal>
      <CustomSnackbar
        open={openSnackBar}
        handleClose={handleCloseSnackbar}
        message={message}
        severity={messageServerity}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default ControlInfor;
