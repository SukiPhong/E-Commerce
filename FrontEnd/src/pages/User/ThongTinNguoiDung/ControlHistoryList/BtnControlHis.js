import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import AllComponent from "./AllComponent";
import ConfirmComponent from "./ConfirmComponent";
import ShippingComponent from "./ShippingComponent";
import CompleteComponent from "./CompleteComponent";
import CancelledComponent from "./CancelledComponent";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../../service/userSlice";

const BtnControlHis = () => {
  const [selectedOption, setSelectedOption] = useState("Tất Cả");
  const accessToken = useSelector(selectAccessToken);
  const [allOrder, setAllOrder] = useState([]);
  const [cancleOrder, setCanCleOrder] = useState([]);
  const [processingOrder, setProcessingOrder] = useState([]);
  const [shippingOrder, setShippingOrder] = useState([]);
  const [successOrder, setSuccessOrder] = useState([]);

  useEffect(() => {
    fetchData();
  });
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/order/", {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      });
      const allOrder = res.data.response;
      const reversedOrders = allOrder.reverse();
      setAllOrder(reversedOrders);

      const cancelledOrders = allOrder.filter(
        (order) => order.status === "Cancelled"
      );
      setCanCleOrder(cancelledOrders);

      const processingArr = allOrder.filter(
        (order) => order.status === "Processing"
      );
      setProcessingOrder(processingArr);

      const shippingArr = allOrder.filter(
        (order) => order.status === "Shipping"
      );
      setShippingOrder(shippingArr);

      const successArr = allOrder.filter((order) => order.status === "Success");
      setSuccessOrder(successArr);
    } catch (error) {}
  };

  const toggleAdd = (option) => {
    setSelectedOption(option);
  };

  const menuOptions = [
    "Tất Cả",
    "Chờ Xác Nhận",
    "Vận Chuyển",
    "Hoàn Thành",
    "Đã Hủy",
  ];

  let componentToDisplay;

  switch (selectedOption) {
    case "Chờ Xác Nhận":
      componentToDisplay = (
        <ConfirmComponent
          fetchData={fetchData}
          processingOrder={processingOrder}
        />
      );
      break;
    case "Vận Chuyển":
      componentToDisplay = (
        <ShippingComponent
          fetchData={fetchData}
          shippingOrder={shippingOrder}
        />
      );
      break;
    case "Hoàn Thành":
      componentToDisplay = (
        <CompleteComponent successOrder={successOrder} fetchData={fetchData} />
      );
      break;
    case "Đã Hủy":
      componentToDisplay = (
        <CancelledComponent cancleOrder={cancleOrder} fetchData={fetchData} />
      );
      break;
    default:
      componentToDisplay = (
        <AllComponent allOrder={allOrder} fetchData={fetchData} />
      );
  }

  return (
    <div className="btn-historyList">
      <div className="menu-his">
        {menuOptions.map((option) => (
          <Button
            key={option}
            onClick={() => toggleAdd(option)}
            className={`btn-his ${selectedOption === option ? "active" : ""}`}
          >
            {option}
          </Button>
        ))}
      </div>
      <div className="searchHistory">
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            className: "search-input",
          }}
        >
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Bạn có thể tìm kiểm tên sản phẩm....."
          />
        </Paper>
      </div>
      <div className="content-his">{componentToDisplay}</div>
    </div>
  );
};

export default BtnControlHis;
