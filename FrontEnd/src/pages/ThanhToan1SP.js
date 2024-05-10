import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../service/userSlice";
import "../Styles/ThanhToan.css";
import Pay from "../component/Pay/Pay";
import { getVoucher, getUserCurrent } from "../service/api";
import voucherSV from "../assets/voucher.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../component/Loading/Loading";

const ThanhToan1SP = () => {
  const accessToken = useSelector(selectAccessToken);
  const Swal = require("sweetalert2");
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  // const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceVoucher, setTotalVoucher] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [voucher, setVoucher] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  // const [paypalButton, setPaypalButton] = useState(false);
  // const [paymentButton, setPaymentButton] = useState(false);
  const getCartData = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  };
  const cart = getCartData();
  const money = ((totalAmount - totalPriceVoucher) / 24250).toFixed(2);
  const fetchDataUser = async () => {
    try {
      const resVoucherArr = await getVoucher();
      const res = await getUserCurrent(accessToken);

      const voucherArrInUser = res.Coupon;
      setUsername(res.username);
      setPhoneNumber(res.phoneNumber);
      setAddressList(res.Address);

      const commonVouchers = resVoucherArr.filter((voucher) =>
        voucherArrInUser.some((userVoucher) => userVoucher.id === voucher.id)
      );
      setVoucher(commonVouchers);
      const total = cart.reduce(
        (acc, cartItem) => acc + cartItem.price * cartItem.count,
        0
      );
      setTotalAmount(total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      fetchDataUser();
    }, 1500);
  }, [accessToken]);

  const handleCashOnDeliveryChange = () => {
    setPaymentMethod("cashOnDelivery");
  };
  const handlePayWithCardChange = () => {
    setPaymentMethod("payWithCard");
  };
  const handleSelectDiaChi = () => {
    if (addressList.length === 0) {
      Swal.fire({
        title: "BẠN CHƯA THÊM ĐỊA CHỈ",
        icon: "info",
      });
      return;
    }

    Swal.fire({
      title: "Chọn Địa Chỉ",
      html:
        '<select id="addressSelect" class="swal2-input">' +
        '<option value="">-- Chọn Địa Chỉ --</option>' +
        addressList
          .map(
            (address, index) => `<option value="${index}">${address}</option>`
          )
          .join("") +
        "</select>",
      showCancelButton: true,
      confirmButtonText: "Chọn",
      cancelButtonText: "Hủy bỏ",
      preConfirm: () => {
        const selectedAddressIndex =
          document.getElementById("addressSelect").value;

        if (!selectedAddressIndex) {
          Swal.showValidationMessage("Vui lòng chọn một địa chỉ!");
        }

        const selectedAddress = addressList[selectedAddressIndex];

        return selectedAddress;
      },
    }).then((result) => {
      if (!result.isDismissed) {
        setSelectedAddress(result.value);
      }
    });
  };
  const handleSelectVoucher = () => {
    const eligibleVouchers = voucher.filter(
      (voucher) =>
        voucher.exclusive !== null && voucher.exclusive <= totalAmount
    );

    if (eligibleVouchers.length === 0) {
      Swal.fire({
        title: "Không có voucher phù hợp",
        icon: "info",
      });
      return;
    }

    Swal.fire({
      title: "Chọn Voucher",
      html:
        '<select id="voucherSelect" class="swal2-input">' +
        '<option value="">-- Chọn Voucher --</option>' +
        eligibleVouchers
          .map(
            (voucher) =>
              `<option value="${voucher._id}">${voucher.name} - ${voucher.discount}% Giảm giá</option>`
          )
          .join("") +
        "</select>",
      showCancelButton: true,
      confirmButtonText: "Chọn",
      cancelButtonText: "Hủy bỏ",
      preConfirm: () => {
        const voucherId = document.getElementById("voucherSelect").value;
        const selectedVoucher = voucher.find(
          (voucher) => voucher._id === voucherId
        );

        if (selectedVoucher) {
          setTotalVoucher(
            totalAmount -
              (totalAmount - (totalAmount * selectedVoucher.discount) / 100)
          );
          setSelectedVoucher(selectedVoucher);
        }

        return selectedVoucher;
      },
    });
  };
  const handleThanhToan = async () => {
    if (!selectedAddress) {
      Swal.fire({
        title: "BẠN CHƯA CHỌN ĐỊA CHỈ",
        icon: "warning",
      });
      return;
    }
    try {
      const createOrderResponse = await axios.post(
        "http://localhost:8000/order/copy",
        {
          products: cart.map((selectedProduct) => ({
            product: selectedProduct.product,
            size: selectedProduct.size,
            count: selectedProduct.count,
            price: selectedProduct.price,
            img: selectedProduct.img,
            name: selectedProduct.name,
          })),
          Note: note,
          address: selectedAddress,
          coupon: selectedVoucher ? selectedVoucher._id : null,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );
      const orderId = createOrderResponse.data.response._id;
      await axios.put(
        `http://localhost:8000/order/status/${orderId}`,
        {
          status: "Processing",
        },
        { headers: { token: `Bearer ${accessToken}` } }
      );

      Swal.fire({
        title: "BẠN ĐÃ ĐẶT HÀNG THÀNH CÔNG",
        icon: "success",
      });
      for (const product of cart) {
        await axios.delete(
          `http://localhost:8000/user/Cart/${product.product}/${product.size}`,
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          }
        );
      }
      Swal.fire({
        title: "BẠN ĐÃ ĐẶT HÀNG THÀNH CÔNG",
        icon: "success",
      });
      localStorage.removeItem("cart");
      localStorage.removeItem("cartList");
      navigate("/thongtin/lichsumuahang");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div class="thanhtoan">
      <div className="thanhtoansecond">
        <div className="thanhtoanleft">
          <div className="thanhtoanleft-main">
            <div className="main-1">
              <h1 style={{ color: "#ee4d2d", fontWeight: "bold" }}>
                THANH TOÁN
              </h1>
            </div>
            <div className="main-2">
              <div className="choseAddress">
                <button
                  className="btnchoseAddress"
                  onClick={handleSelectDiaChi}
                >
                  Chọn Địa Chỉ
                </button>
              </div>
              {selectedAddress ? (
                <div className="addressField">
                  <div className="addressFieldRight">
                    <div className="infoaddress">
                      <span className="address-left">Họ tên: </span>
                      <p className="address">{username}</p>
                    </div>
                    <div className="infoaddress">
                      <span className="address-left">Điện Thoại: </span>
                      <p className="address"> {phoneNumber}</p>
                    </div>
                    <div className="infoaddress">
                      <span className="address-left">Địa chỉ: </span>
                      <p className="address">{selectedAddress}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="addressField">
                  <p className="noaddress">Bạn chưa chọn địa chỉ</p>
                </div>
              )}
            </div>
            <div className="main-3">
              <div className="large-input-container">
                <label htmlFor="largeInput">Ghi chú:</label>
                <textarea
                  id="largeInput"
                  placeholder="Ghi ở đây..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
            <div className="main-5">
              <button className="payCart" onClick={handleSelectVoucher}>
                Chọn Voucher
              </button>
              {selectedVoucher ? (
                <div className="voucherischoose">
                  <div key={selectedVoucher._id} class="voucher-list-container">
                    <img src={voucherSV} alt="" />
                    <div className="voucher-list-container-information">
                      <label>Giảm tối thiểu {selectedVoucher.discount}%</label>
                      <br />
                      <label>Đơn tối thiểu {selectedVoucher.exclusive}Đ</label>
                      <br />
                      <label style={{ color: "red" }}>
                        Hết hạn:{" "}
                        {new Date(selectedVoucher.expiry).toLocaleDateString()}
                      </label>{" "}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="voucherischoose">
                  <p>Chưa chọn Voucher</p>
                </div>
              )}
            </div>
            <div className="main-4">
              <h2>Phương thức thanh toán</h2>
              <div className="checkField">
                <input
                  type="checkbox"
                  id="cashOnDeliveryCheckbox"
                  checked={paymentMethod === "cashOnDelivery"}
                  onChange={handleCashOnDeliveryChange}
                />
                <label htmlFor="cashOnDeliveryCheckbox">
                  Thanh toán khi nhận hàng
                </label>
              </div>
              <div className="checkField">
                <input
                  type="checkbox"
                  id="payWithPayPalCheckbox"
                  checked={paymentMethod === "payWithCard"}
                  onChange={handlePayWithCardChange}
                />
                <label htmlFor="payWithPayPalCheckbox">
                  Thanh toán điện tử
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="thanhtoanright">
          <div className="thanhtoanright-top">
            <p style={{ width: "55%", textAlign: "center" }}>
              Sản Phẩm ({cart.length === 0 ? "0" : cart.length} sản phẩm)
            </p>
            <p style={{ width: "25%", textAlign: "center" }}>Số Lượng</p>
            <p style={{ width: "20%", textAlign: "center" }}>Giá</p>
          </div>
          <div className="thanhtoanright-bottom">
            {cart.map((item) => (
              <div key={item._id} className="itemProductOrder">
                <div className="bottom1">
                  <img src={item.img} alt="" />
                  <div className="bottom1Right">
                    <h1>{item.name}</h1>
                    <p>Size: {item.size}</p>
                  </div>
                </div>
                <div className="bottom2">
                  <p style={{ fontSize: "1.4rem" }}>{item.count} Đôi</p>
                </div>
                <div className="bottom3">
                  <p style={{ fontSize: "1.4rem", color: "#ee4d2d" }}>
                    {item.price.toLocaleString()} VNĐ
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="thanhtoanrightLast">
            <div className="thanhtoanrightLast-1">
              <div className="cost1">
                <h3>Tổng tiền sản phẩm: </h3>
                <h3>Giảm: </h3>
                <h3>Tổng cộng: </h3>
              </div>
              <div className="cost2">
                <h2>{totalAmount.toLocaleString()} VNĐ</h2>
                <h2>{totalPriceVoucher.toLocaleString()} VNĐ</h2>
                <h2>
                  {(totalAmount - totalPriceVoucher).toLocaleString()} VNĐ
                </h2>
              </div>
            </div>
            <div className="thanhtoanrightLast-2">
              {paymentMethod === "cashOnDelivery" && (
                <button className="btnPayment" onClick={handleThanhToan}>
                  Thanh Toán
                </button>
              )}
              {paymentMethod === "payWithCard" && (
                <div style={{ margin: "10px" }}>
                  <Pay
                    payload={{
                      products: cart,
                      address: selectedAddress,
                      Note: note,
                      coupon: selectedVoucher,
                      totalPrice: { money },
                    }}
                    amount={money}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanhToan1SP;
