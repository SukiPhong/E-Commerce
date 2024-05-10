export const renderTextStatus = (status) => {
  switch (status) {
    case "Processing":
      return <p>ĐANG CHỜ XÁC NHẬN</p>;
    case "Cancelled":
      return <p style={{ color: "red" }}>ĐÃ HỦY ĐƠN HÀNG</p>;
    case "Shipping":
      return <p style={{ color: "#ee8d2d" }}>ĐÃ CHUYỂN ĐƠN HÀNG</p>;
    case "Success":
      return <p style={{ color: "green" }}>ĐÃ NHẬN HÀNG</p>;
    default:
      return null;
  }
};
