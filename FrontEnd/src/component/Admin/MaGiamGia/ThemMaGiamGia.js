import React, { useState } from "react";
import LeftMenu from "../LeftMenu";
import "../Styles/MaGiamGia.css";
import PercentIcon from "@mui/icons-material/Percent";
import Loading from "../../Loading/Loading";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectAccessToken } from "../../../service/userSlice";

const ThemMaGiamGia = () => {
  const [selectedNameOption, setSelectedNameOption] = useState("");
  const [discountVoucher, setDiscountVoucher] = useState("");
  const [expiryVoucher, setExpiryVoucher] = useState("");
  const [exclusiveVoucher, setExclusiveVoucher] = useState("");
  const accessToken = useSelector(selectAccessToken);
  const [isSaving, setisSaving] = useState(false);
  const Swal = require("sweetalert2");

  const handleSelectNameChange = (event) => {
    setSelectedNameOption(event.target.value);
  };
  const handleDiscount = (event) => {
    setDiscountVoucher(event.target.value);
  };
  const handleExpiry = (event) => {
    setExpiryVoucher(event.target.value);
  };
  const handleExclusive = (event) => {
    setExclusiveVoucher(event.target.value);
  };

  const handleSubmit = async () => {
    setisSaving(true);

    try {
      await axios.post(
        "http://localhost:8000/coupon",
        {
          name: selectedNameOption,
          discount: discountVoucher,
          expiry: expiryVoucher,
          exclusive: exclusiveVoucher,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
        }
      );
      Swal.fire("Đã Thêm!", "Voucher đã được thêm thành công.", "success");
    } catch (error) {
      console.log(error);
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
            <h1 className="danh-muc-title">Thêm mã giảm giá</h1>
          </div>
          <div className="addVoucherMain">
            <div className="add-voucher">
              <div className="headAdd">
                <p>Chọn Mã Giảm Giá</p>
                <p style={{ color: "red" }}>*</p>
              </div>
              <div className="select-container">
                <input
                  type="text"
                  className="input-voucher"
                  onChange={handleSelectNameChange}
                  placeholder="Nhập tên voucher...."
                />
              </div>
            </div>
            <div className="add-voucher">
              <div className="headAdd">
                <p>Nhập Giá Trị Mã Giảm</p>
                <p style={{ color: "red" }}>*</p>
              </div>
              <div className="select-container">
                <input
                  className="input-voucher"
                  placeholder="Nhập giá trị"
                  type="number"
                  onChange={(e) => handleDiscount(e)}
                  value={discountVoucher}
                />
                <div className="icon-percent">
                  <PercentIcon sx={{ fontSize: "3rem" }} />
                </div>
              </div>
            </div>
            <div className="add-voucher">
              <div className="headAdd">
                <p>Nhập Giá Trị Đơn Hàng Áp Dụng</p>
                <p style={{ color: "red" }}>*</p>
              </div>
              <div className="select-container">
                <input
                  className="input-voucher"
                  placeholder="Nhập số tiền"
                  type="number"
                  onChange={(e) => handleExclusive(e)}
                  value={exclusiveVoucher}
                />
                <div className="icon-percent">
                  <p>Đồng</p>
                </div>
              </div>
            </div>
            <div className="add-voucher">
              <div className="headAdd">
                <p>Nhập Thời Gian Sử Dụng</p>
                <p style={{ color: "red" }}>*</p>
              </div>
              <div className="select-container">
                <input
                  className="input-voucher"
                  placeholder="Nhập thời gian"
                  type="text"
                  onChange={(e) => handleExpiry(e)}
                  value={expiryVoucher}
                />
                <div className="icon-percent">
                  <p>Ngày</p>
                </div>
              </div>
            </div>

            <div className="add-voucher">
              <button onClick={handleSubmit} className="btn-add-voucher">
                {isSaving ? <Loading /> : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemMaGiamGia;
