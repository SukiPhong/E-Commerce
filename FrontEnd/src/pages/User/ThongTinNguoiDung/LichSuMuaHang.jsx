import React from "react";
import "./ThongTinNguoiDung.css";
import ControlInfor from "./ControlInfor";
import BtnControlHisLis from "./ControlHistoryList/BtnControlHis";

const LichSuMuaHang = () => {
  return (
    <div className="container-thongtin">
      <ControlInfor />
      <div className="content-infor lichsumuahang">
        <BtnControlHisLis />
      </div>
    </div>
  );
};

export default LichSuMuaHang;
