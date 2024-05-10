// ForgotPass.js
import React, { useState } from "react";
import "./Form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import axios from "axios";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const Swal = require("sweetalert2");

  const toggleWrapperRemoveForgotPass = () => {
    const wrapper = document.querySelector(".wrapper");
    wrapper.classList.remove("active-forgotpass");
  };

  const toggleWrapperAddForgotPass = () => {
    const wrapper = document.querySelector(".wrapper");
    wrapper.classList.add("active");
    wrapper.classList.remove("active-forgotpass");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.post(
        `http://localhost:8000/user/forgotPassword?email=${email}`
      );
      Swal.fire({
        icon: "success",
        title: "Yêu cầu đã được gửi thành công! Hãy kiểm tra lại email của bạn",
      });
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu:", error);
      Swal.fire({
        icon: "error",
        title: "Bạn đã nhập sai email hoặc do email chưa đăng ký",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Box className="form-box forgotpass">
        <h2>QUÊN MẬT KHẨU</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box-forgotpass">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="btnOTP">
            <button type="submit" className="Btn-otp" disabled={saving}>
              {saving ? "ĐANG GỬI..." : "XÁC NHẬN"}
            </button>
          </div>
          <div className="login-forgotpass">
            <p>
              <Link
                className="forgotpass-link"
                onClick={toggleWrapperRemoveForgotPass}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faArrowAltCircleLeft}
                ></FontAwesomeIcon>{" "}
                Đăng Nhập
              </Link>
            </p>
            <p>
              <Link
                className="forgotpass-link"
                onClick={toggleWrapperAddForgotPass}
              >
                Tạo Tài Khoản{" "}
                <FontAwesomeIcon icon={faArrowAltCircleRight}></FontAwesomeIcon>{" "}
              </Link>
            </p>
          </div>
        </form>
      </Box>
    </>
  );
};

export default ForgotPass;
