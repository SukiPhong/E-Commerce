import React, { useState } from "react";
import "./Form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Box } from "@mui/material";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const Signup = () => {
  const [open, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [messageServerity, setMessageServerity] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const Swal = require("sweetalert2");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const toggleWrapperRemove = () => {
    const wrapper = document.querySelector(".wrapper");
    wrapper.classList.remove("active");
  };

  const handleClick = () => {
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const clearFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fetchUserData = async (event) => {
    event.preventDefault();
    setIsSigningUp(true);
    const userDataToSend = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/user/register",
        userDataToSend
      );
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Bạn đã đăng ký tài khoản thành công",
        });
        clearFields();
        toggleWrapperRemove();
      } else {
        setMessage("Email hoặt tên đăng nhập đã được sử dụng");
        setMessageServerity("error");
        handleClick();
      }
    } catch (error) {
      setMessage("Email hoặt tên đăng nhập đã được sử dụng");
      setMessageServerity("error");
      handleClick();
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <>
      {" "}
      <Box
        sx={{
          width: "60%",
          height: "100%",
        }}
        className="form-box signup"
      >
        <h2>TẠO TÀI KHOẢN</h2>
        <form onSubmit={fetchUserData}>
          <div className="input-box">
            <span className="icon">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username">Họ và tên</label>
          </div>
          <div className="input-box">
            <span className="icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
            <label htmlFor="password">Mật khẩu</label>
          </div>
          <button
            type="submit"
            name="signup"
            className="Btn"
            disabled={isSigningUp}
          >
            {isSigningUp ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
          </button>

          <div className="login-register">
            <p>
              Bạn chưa có tài khoản?{" "}
              <button
                type="button"
                className="register-link"
                onClick={toggleWrapperRemove}
              >
                ĐĂNG NHẬP
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={messageServerity}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.5rem",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;
