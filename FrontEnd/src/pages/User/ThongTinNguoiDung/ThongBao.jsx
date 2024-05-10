import React from "react";
import "./ThongTinNguoiDung.css";
import ControlInfor from "./ControlInfor";

const ThongBao = () => {
    return (
        <div className="container-thongtin">
          <ControlInfor />
          <div className="content-infor"></div>
        </div>
      );
}

export default ThongBao