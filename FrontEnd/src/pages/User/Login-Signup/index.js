import React, { useEffect } from "react";
import "./Form.css";
import DangNhap from "./DangNhap";
import QuenMK from "./QuenMK";
import DangKy from "./DangKy";
import Container from "@mui/material/Container";

export const LoginSignupPage = () => {
  useEffect(() => {
    localStorage.removeItem("cart");
    localStorage.removeItem("cartList");
  });
  return (
    <Container maxWidth="md" className="wrapper" sx={{ height: "80vh" }}>
      <DangNhap />
      <QuenMK />
      <DangKy />
    </Container>
  );
};
