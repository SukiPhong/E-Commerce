import React, { useState } from "react";
import "./reset.css";
import { Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useParams } from "react-router";
import axios from "axios";
import Loading from "../../../component/Loading/Loading";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const ResetPass = () => {
  const [password, setNewPassword] = useState("");
  const [open, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] = useState("");
  const { token } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put("http://localhost:8000/user/resetpassword", {
        password,
        token,
      });

      setMessage("Đã thay đổi mật khẩu thành công.");
      setMessageSeverity("success");
      handleClick();
    } catch (error) {
      setMessage("Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.");
      setMessageSeverity("error");
      handleClick();
    } finally {
      setLoading(false);
      setNewPassword("");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mainReset">
      <div className="imageBack">
        <Box className="form-box forgotpass">
          <h2>THAY ĐỔI MẬT KHẨU</h2>
          <form>
            <div className="input-box-forgotpass">
              <input
                type="password"
                name="newPassword"
                value={password}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label htmlFor="newPassword">Mật khẩu mới</label>
            </div>
            <div className="btnOTP">
              <button onClick={handleSubmit} type="submit" className="Btn-otp">
                Xác Nhận
              </button>
            </div>
          </form>
        </Box>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={messageSeverity}
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
    </div>
  );
};

export default ResetPass;
