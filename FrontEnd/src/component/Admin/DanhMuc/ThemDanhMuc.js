import React, { useState } from "react";
import LeftMenu from "../LeftMenu";
import "../Styles/DanhMuc.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAdmin, selectAccessToken } from "../../../service/userSlice";

const ThemDanhMuc = () => {
  const [danhMuc, setDanhMuc] = useState("");
  const admin = useSelector(selectAdmin);
  const accessToken = useSelector(selectAccessToken);
  const Swal = require("sweetalert2");

  const handleDanhMucChange = (e) => {
    setDanhMuc(e.target.value);
  };

  const handleThemDanhMuc = () => {
    if (danhMuc.trim() !== "") {
      if (!admin) {
        console.error("Không có quyền thêm danh mục.");
        return;
      }
      const data = {
        categoryName: danhMuc,
      };
      axios
        .post("http://localhost:8000/Category", data, {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Đã thêm danh mục thành công",
          });
          setDanhMuc("");
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: `Danh mục ${danhMuc} đã được thêm`,
          });
        });
    }
  };

  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <div className="right-main">
          <div className="heading-right">
            <h1 className="danh-muc-title">Thêm danh mục</h1>
          </div>
          <div className="themdanhmucfield">
            <div className="insert-danhmuc-danhmuc">
              <p>Nhập Tên Danh Mục</p>
              <input
                className="input-danhmuc-danhmuc"
                type="text"
                placeholder="Nhập tên danh mục"
                value={danhMuc}
                onChange={handleDanhMucChange}
              />
              <button className="btn-themdanhmuc" onClick={handleThemDanhMuc}>
                Thêm danh mục
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemDanhMuc;
