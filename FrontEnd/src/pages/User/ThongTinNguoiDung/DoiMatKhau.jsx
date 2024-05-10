import React, { useState, useEffect } from "react";
import ControlInfor from "./ControlInfor";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken } from "../../../service/userSlice";
import { getUserCurrent } from "../../../service/api";
import axios from "axios";
import { setLogout } from "../../../service/userSlice";
import { useNavigate } from "react-router-dom";

const DoiMatKhau = () => {
  const accessToken = useSelector(selectAccessToken);
  const [idUser, setIdUser] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // Use a state for the new password
  const [confirmPassword, setConfirmPassword] = useState(""); // Use a state for confirming password
  const Swal = require("sweetalert2");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        try {
          const res = await getUserCurrent(accessToken);
          setIdUser(res._id);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [accessToken]);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login-register");
  };

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Mật khẩu xác nhận không khớp!!!",
        icon: "error",
      });
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append("password", newPassword);

    try {
      await axios.put(`http://localhost:8000/user/update/${idUser}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: `Bearer ${accessToken}`,
        },
      });

      Swal.fire({
        title: "Đổi mật khẩu thành công!!!",
        text: "Hãy đăng nhập lại",
        icon: "success",
        timer: 3000,
      });
      setTimeout(() => {
        handleLogout();
      }, 3000);
    } catch (error) {
      console.error("Error while calling API:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container-thongtin">
      <ControlInfor />
      <div className="content-infor doimatkhau">
        {accessToken ? (
          <div className="doimatkhauCotent">
            <div className="doimatkhauField">
              <input
                placeholder="Nhập mật khẩu mới"
                className="inpDoiMatKhau"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                placeholder="Nhập lại mật khẩu"
                className="inpDoiMatKhau"
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="doimatkhauBTN">
              <button className="btn-doimatkhau" onClick={handleSaveChanges}>
                {isSaving ? "Đang thực hiện..." : "Đổi Mật Khẩu"}
              </button>
            </div>
          </div>
        ) : (
          <h1>BẠN CHƯA ĐĂNG NHẬP</h1>
        )}
      </div>
    </div>
  );
};

export default DoiMatKhau;
