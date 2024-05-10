import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Box } from "@mui/material";
import Loading from "../../../component/Loading/Loading";
import { useDispatch } from "react-redux";
import {
  setUser,
  setAdmin,
  setAccessToken,
  setLogin,
} from "../../../service/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const Swal = require("sweetalert2");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/user/login",
        formData
      );
      const user = response.data.user;
      const accessToken = response.data.AccessToken;
      dispatch(setAccessToken(accessToken));
      dispatch(setUser(user));
      dispatch(setAdmin(user.admin));
      dispatch(setLogin(true));

      if (user.admin) {
        setTimeout(() => {
          navigate("/admin-dashbar");
        }, 1200);
      }
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      setLoading(false);
      console.error("Đăng nhập không thành công", error);
      Swal.fire({
        icon: "warring",
        title:
          "Đăng nhập không thành công. Vui lòng kiểm tra tên đăng nhập và mật khẩu",
      });
    }
  };

  const toggleWrapperAdd = () => {
    const wrapper = document.querySelector(".wrapper");
    wrapper.classList.add("active");
  };

  const toggleWrapperAddForgotPass = () => {
    const wrapper = document.querySelector(".wrapper");
    wrapper.classList.add("active-forgotpass");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Box
        maxWidth="100%"
        sx={{
          width: "60%",
          height: "100%",
        }}
        className="form-box login"
      >
        <h2>ĐĂNG NHẬP</h2>
        <form onSubmit={handleLogin}>
          <div className="input-box">
            <span className="icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-box">
            <span className="icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              required
            />
            <label htmlFor="password">Mật khẩu</label>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Ghi nhớ tài khoản
            </label>
            <button
              type="button"
              className="forgot-pass"
              onClick={toggleWrapperAddForgotPass}
            >
              Bạn quên mật khẩu?
            </button>
          </div>
          <button type="submit" name="login" className="Btn">
            ĐĂNG NHẬP
          </button>

          <div className="login-register">
            <p>
              Bạn chưa có tài khoản?{" "}
              <button
                type="button"
                className="register-link"
                onClick={toggleWrapperAdd}
              >
                ĐĂNG KÝ{"   "}{" "}
              </button>
            </p>
          </div>

          <div className="signInwith">
            <div className="signInwithGoogle">
              <span className="icon-SignIn">
                <FontAwesomeIcon icon={faGoogle} />
              </span>
              <p>Đăng nhập với Google</p>
            </div>
            <h5> - HOẶC - </h5>
            <div className="signInwithGitHub">
              <span className="icon-SignIn">
                <FontAwesomeIcon icon={faFacebook} />
              </span>
              <p>Đăng nhập với Facebook</p>
            </div>
          </div>
        </form>
      </Box>
    </>
  );
};

export default Login;
