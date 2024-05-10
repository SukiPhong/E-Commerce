import React, { useState, useEffect } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Breadcrumb = () => {
  const location = useLocation();
  const breadcrumb = location.pathname.split("/");
  const [product, setProduct] = useState(null);
  const [cate, setCate] = useState(null);

  // console.log(breadcrumb.length);

  const excludedRoutes = [
    "",
    "login-register",
    "reset-password",
    "admin-dashbar",
    "danhmuc",
    "danhsachdanhmuc",
    "themdanhmuc",
    "nhanhieu",
    "danhsachnhanhieu",
    "themnhanhieu",
    "sanphamadmin",
    "danhsachsanphamadmin",
    "themsanpham",
    "taikhoanadmin",
    "hoadon",
    "magiamgiaadmin",
    "danhgia",
    "thongke",
    "edit-product",
    "danhsachvoucher",
    "themmagiamgia",
    "giohang",
    "thanhtoan",
    "magiamgia",
    "magiamgiashop",
  ];
  useEffect(() => {
    if (
      breadcrumb.length === 3 &&
      breadcrumb[0] === "" &&
      breadcrumb[1] === "chitietsanpham"
    ) {
      const currentPath = breadcrumb[2];
      if (currentPath) {
        const matchProductId = currentPath.match(/([a-fA-F0-9]{24})/);
        if (matchProductId) {
          const productId = matchProductId[1];
          fetchData(productId);
        }
      }
    } else if (
      breadcrumb.length === 4 &&
      breadcrumb[0] === "" &&
      breadcrumb[1] === "sanpham" &&
      breadcrumb[2] === "danhmucsanpham"
    ) {
      const currentPath = breadcrumb[3];
      if (currentPath) {
        const matchProductId = currentPath.match(/([a-fA-F0-9]{24})/);
        if (matchProductId) {
          const CateId = matchProductId[1];
          fetchDataCate(CateId);
        }
      }
    }
  }, [location]);

  const fetchData = async (productId) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/product?_id=${productId}`
      );
      setProduct(res.data.productDatas);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  const fetchDataCate = async (CatetId) => {
    try {
      const res = await axios.get(`http://localhost:8000/Category/${CatetId}`);
      setCate(res.data.getOneCategory);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  const routeLabels = {
    sanpham: "Sản Phẩm",
    magiamgia: "Mã Giảm Giá",
    chitietsanpham: "Chi Tiết Sản Phẩm",
    [`${product?.[0]?._id}`]: product && product[0]?.productName,
    [cate && `${cate._id}`]: cate && cate.categoryName,
    bosuutap: "Bộ Sưu Tập",
    giohang: "Giỏ Hàng",
    thongtin: "Hồ Sơ Của Tôi",
    diachi: "Địa Chỉ",
    lichsumuahang: "Lịch Sử Của Tôi",
    voucher: "Kho Voucher",
    thongbao: "Thông Báo",
    yeuthich: "Sản Phẩm Yêu Thích",
    danhmucsanpham: "Danh Mục",
    doimatkhau: "Đổi Mật Khẩu",
  };

  if (excludedRoutes.includes(breadcrumb[1])) {
    return null;
  }

  return (
    <div
      style={{ backgroundColor: "#f0f0f0", height: "100%" }}
      role="presentation"
    >
      <Breadcrumbs
        separator="›"
        sx={{ fontSize: "2rem", padding: "1rem" }}
        aria-label="breadcrumb"
      >
        {breadcrumb.map((item) => (
          <Link
            className="breadcrumb"
            key={item}
            sx={{
              color: "black",
              textDecoration: "none",
              fontSize: "1.2rem",
            }}
          >
            {item === "" ? "Trang Chủ" : routeLabels[item] || item}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default Breadcrumb;
