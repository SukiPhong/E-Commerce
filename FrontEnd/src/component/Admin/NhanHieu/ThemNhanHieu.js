import React, { useState } from "react";
import LeftMenu from "../LeftMenu";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAdmin, selectAccessToken } from "../../../service/userSlice";
import "../Styles/NhanHieu.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ThemNhanHieu = () => {
  const [tenNhanHieu, setTenNhanHieu] = useState("");
  const accessToken = useSelector(selectAccessToken);
  const admin = useSelector(selectAdmin);
  const [notification, setNotification] = useState(null);
  const [notificationError, showNotificationError] = useState(null);
  const [isSaving, setisSaving] = useState(false);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
      showNotificationError(null);
    }, 3000);
  };

  const handleNhanHieuChange = (e) => {
    setTenNhanHieu(e.target.value);
  };

  const handleThemNhanHieu = async () => {
    setisSaving(true);
    if (tenNhanHieu === "") {
      showNotificationError("Chưa điền tên nhãn hiệu.");
    }

    const data = {
      brandName: tenNhanHieu,
    };

    try {
      await axios.post("http://localhost:8000/brand", data, {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      });
      showNotification("Nhãn hiệu đã được thêm thành công.");
    } catch (error) {
      showNotificationError("Đã xảy ra lỗi khi thêm nhãn hiệu.");
    } finally {
      setisSaving(false);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <div className="right-main">
          <div className="heading-right">
            <h1 className="danh-muc-title">Thêm Nhãn Hiệu</h1>
          </div>
          <div className="insert-danhmuc">
            <div className="insertNhanHieu">
              <div className="iconHoaThi">
                <p>Nhập tên nhãn hiệu </p> <p style={{ color: "red" }}> *</p>
              </div>
              <input
                className="input-danhmuc"
                type="text"
                placeholder="Nhập tên nhãn hiệu"
                value={tenNhanHieu}
                onChange={handleNhanHieuChange}
              />
            </div>
            {admin && (
              <button className="btn-themdanhmuc" onClick={handleThemNhanHieu}>
                {isSaving ? "Đang thêm....." : "Thêm Nhãn Hiệu"}
              </button>
            )}
          </div>
        </div>
      </div>
      {notification && (
        <div className="notification">
          <CheckCircleOutlineIcon sx={{ marginRight: "5px" }} />
          {notification}
        </div>
      )}
      {notificationError && (
        <div className="notificationError">
          <ErrorOutlineIcon sx={{ marginRight: "5px" }} />
          {notificationError}
        </div>
      )}
    </div>
  );
};

export default ThemNhanHieu;
