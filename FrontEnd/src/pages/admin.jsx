import * as React from "react";
import "../Styles/admin.css";
import LeftMenu from "../component/Admin/LeftMenu";
import { useEffect } from "react";

const Admin = () => {
  useEffect(() => {
    localStorage.removeItem("cart");
    localStorage.removeItem("cartList");
  });
  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <div className="right-main"></div>
      </div>
    </div>
  );
};

export default Admin;
