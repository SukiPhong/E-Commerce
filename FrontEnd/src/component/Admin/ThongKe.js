import React, { useState, useEffect } from "react";
import LeftMenu from "./LeftMenu";
import "./Styles/ThongKe.css";
import { BarChart } from "@mui/x-charts/BarChart";
import MoneyBag from "../../assets/money-bag.png";
import ShoppingBag from "../../assets/shopping-bag (1).png";
import { getAllOrder } from "../../service/api";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../service/userSlice";

const ThongKe = () => {
  const accessToken = useSelector(selectAccessToken);
  const [tongDon, setTongDon] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedYear, setSelectedYear] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState(
    Array.from({ length: 12 }, () => 0)
  );

  useEffect(() => {
    fetchData();
  }, [selectedYear, accessToken]);

  const roundToTwoDecimalPlaces = (value) => Math.round(value * 100) / 100;

  const fetchData = async () => {
    try {
      const res = await getAllOrder(accessToken);

      const filteredOrders = selectedYear
        ? res.filter(
            (order) =>
              new Date(order.createdAt).getFullYear() ===
              parseInt(selectedYear, 10)
          )
        : res;

      const monthlyRevenue = Array.from({ length: 12 }, () => 0);

      filteredOrders.forEach((order) => {
        const month = new Date(order.createdAt).getMonth();
        monthlyRevenue[month] += order.totalPrice;
      });

      setTongDon(filteredOrders.length);
      setTotalPrice(
        roundToTwoDecimalPlaces(
          filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0)
        ).toLocaleString()
      );
      setMonthlyRevenue(monthlyRevenue);
    } catch (error) {
      console.log(error);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <div className="right-main">
          <div className="heading-right">
            <h1 className="danh-muc-title">THỐNG KÊ DOANH THU</h1>
          </div>
          <div className="midcontent">
            <div className="dateThongKe">
              <div className="dateThongKeField">
                <div className="dateThongKeItem">
                  <p>Năm: </p>
                  <select
                    className="btnYear"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    <option value="">Chọn năm</option>
                    {Array.from(
                      { length: new Date().getFullYear() - 1999 },
                      (_, index) => 2000 + index
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="infoThongKe">
              <div className="tongdonanddoanhthu">
                <div className="tongdonanddoanhthu-right">
                  <p>Tổng Đơn</p>
                  <p>{tongDon} Đơn</p>
                </div>
                <div className="tongdonanddoanhthu-left">
                  <img
                    className="imgtongdonanddoanhthu"
                    src={ShoppingBag}
                    alt=""
                  />
                </div>
              </div>
              <div className="tongdonanddoanhthu">
                <div className="tongdonanddoanhthu-right">
                  <p>Doanh Thu</p>
                  <p>{totalPrice} VNĐ</p>
                </div>{" "}
                <div className="tongdonanddoanhthu-left">
                  <img
                    className="imgtongdonanddoanhthu"
                    src={MoneyBag}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="botContent">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: [
                    "Tháng 1",
                    "Tháng 2",
                    "Tháng 3",
                    "Tháng 4",
                    "Tháng 5",
                    "Tháng 6",
                    "Tháng 7",
                    "Tháng 8",
                    "Tháng 9",
                    "Tháng 10",
                    "Tháng 11",
                    "Tháng 12",
                  ],
                },
              ]}
              series={[{ data: monthlyRevenue }]}
              width={1000}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongKe;
