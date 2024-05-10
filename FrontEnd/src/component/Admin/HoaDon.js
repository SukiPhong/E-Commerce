import React, { useState, useEffect } from "react";
import LeftMenu from "./LeftMenu";
import axios from "axios";
import "./Styles/HoaDon.css";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../service/userSlice";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getAllOrder, getAllUser } from "../../service/api";

const ITEMS_PER_PAGE = 10;

const HoaDon = () => {
  const [hoaDonData, setHoaDonData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const accessToken = useSelector(selectAccessToken);
  const Swal = require("sweetalert2");

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const fetchData = async () => {
    try {
      const orderArrAll = await getAllOrder(accessToken);
      const userArr = await getAllUser(accessToken);
      const processingOrders = orderArrAll.filter(
        (order) => order.status === "Processing"
      );

      const updatedProcessingOrders = processingOrders.map((order) => {
        const correspondingUser = userArr.find(
          (user) => user._id === order.OrderBy
        );

        if (correspondingUser) {
          return {
            ...order,
            username: correspondingUser.username,
          };
        }

        return order;
      });

      setHoaDonData(updatedProcessingOrders);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy đơn hàng:", error);
    }
  };
  const hanleSetShipping = async (oid) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắc chắn muốn xác nhận đơn hàng này?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7f7ffa",
        cancelButtonColor: "#ed4956",
        confirmButtonText: "Xác nhận",
      });

      if (result.isConfirmed) {
        await axios.put(
          `http://localhost:8000/order/status/${oid}`,
          { status: "Shipping" },
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          }
        );
        Swal.fire("Đã xác nhận đơn hàng!", "", "success");
        fetchData();
      }
    } catch (error) {
      // Handle error if needed
      console.error("Error while updating order status:", error);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = hoaDonData.slice(startIndex, endIndex);

  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <div className="right-main">
          <div className="heading-right">
            <h1 className="danh-muc-title">Danh Sách Hóa Đơn</h1>
          </div>
          <div className="table-right">
            <table style={{ width: "80%" }}>
              <thead>
                <tr className="heading-table">
                  <th>STT</th>
                  <th>Người đặt</th>
                  <th>Số lượng sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(hoaDonData) && hoaDonData.length > 0 ? (
                  currentOrders.reverse().map((order, index) => (
                    <tr key={order._id}>
                      <td className="body-table">{index + 1}</td>
                      <td className="body-table">{order.username}</td>
                      <td
                        style={{ textAlign: "center" }}
                        className="body-table"
                      >
                        {order.products.length} đôi
                      </td>
                      <td
                        style={{ textAlign: "center" }}
                        className="body-table"
                      >
                        {order.totalPrice.toLocaleString()} VNĐ
                      </td>
                      <td
                        style={{ textAlign: "center" }}
                        className="body-table"
                      >
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td
                        style={{ textAlign: "center", color: "#7f7ffa" }}
                        className="body-table"
                      >
                        {order.status}
                      </td>
                      <td
                        style={{ textAlign: "center" }}
                        className="body-table"
                      >
                        <Button
                          onClick={() => hanleSetShipping(order._id)}
                          sx={{ backgroundColor: "#7f7ffa", color: "white" }}
                          className="btn-deleteall"
                        >
                          Xác nhận
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">Không có dữ liệu hóa đơn.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              <button
                className="btn-page-admin"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ArrowBackIcon />
              </button>
              <p>{currentPage}</p>
              <button
                className="btn-page-admin"
                disabled={currentPage * ITEMS_PER_PAGE >= hoaDonData.length}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ArrowForwardIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoaDon;
