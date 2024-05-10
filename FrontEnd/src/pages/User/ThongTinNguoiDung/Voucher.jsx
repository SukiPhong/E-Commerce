import React, { useEffect, useState } from "react";
import "./ThongTinNguoiDung.css";
import ControlInfor from "./ControlInfor";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import voucherSV from "../../../assets/voucher.png";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../service/userSlice";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Voucher = () => {
  const [freeShipVoucher, setFreeShipVoucher] = useState([]);
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    if (accessToken) {
      try {
        const resUser = await axios.get("http://localhost:8000/user/current/", {
          headers: { token: `Bearer ${accessToken}` },
        });
        const res = await axios.get("http://localhost:8000/coupon");

        const voucherInUser = resUser.data.user.Coupon;
        const voucherRes = res.data.data;
        const freeShipVouchers = voucherRes.filter(
          (voucher) => !voucherInUser.includes(voucher._id)
        );
        setFreeShipVoucher(freeShipVouchers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div className="container-thongtin">
      <ControlInfor />
      <div className="content-infor voucher">
        {accessToken ? (
          <Box sx={{ width: "100%" }}>
            <Stack direction="row" useFlexGap flexWrap="wrap" spacing={5}>
              {freeShipVoucher.map((coupon, index) => (
                <Item
                  sx={{
                    width: 300,
                    height: 100,
                    background: "transition",
                    display: "flex",
                  }}
                >
                  <img style={{ width: "35%" }} src={voucherSV} alt="Voucher" />{" "}
                  <div className="info-coupon">
                    <h3>{coupon.name}</h3>
                    <p style={{ fontSize: "1.2rem", textAlign: "left" }}>
                      Đơn hàng có giá trị:{" "}
                      {coupon.exclusive.toLocaleString("vn-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p style={{ fontSize: "1.2rem", textAlign: "left" }}>
                      Giảm: {coupon.discount}%
                    </p>
                    <p style={{ color: "red" }}>
                      Ngày hết hạn:{" "}
                      {new Date(coupon.expiry).toLocaleDateString()}
                    </p>
                  </div>
                </Item>
              ))}
            </Stack>
          </Box>
        ) : (
          <h1>BẠN CHƯA ĐĂNG NHẬP</h1>
        )}
      </div>
    </div>
  );
};

export default Voucher;
