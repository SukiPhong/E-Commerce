import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import sliderVoucher1 from "../assets/sliderVoucher1.jpg";
import sliderVoucher2 from "../assets/sliderVoucher2.jpg";
import "../Styles/MaGiamGia.css";
import Loading from "../component/Loading/Loading";
import voucherSV from "../assets/voucher.png";
import axios from "axios";
import { useSelector } from "react-redux";
import DifferentProduct from "../component/Slider/DifferentProduct";
import { selectAccessToken } from "../service/userSlice";

const MaGiamGiaShop = () => {
  const [freeShipVoucher, setFreeShipVoucher] = useState([]);
  const Swal = require("sweetalert2");
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("cart");
      localStorage.removeItem("cartList");
      setLoading(false);
    }, 1200);
  }, []);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (accessToken) {
        const resUser = await axios.get("http://localhost:8000/user/current/", {
          headers: { token: `Bearer ${accessToken}` },
        });

        const res = await axios.get("http://localhost:8000/coupon");

        const voucherRes = res.data.data;
        const voucherInUser = resUser.data.user.Coupon;

        const freeShipVouchers = voucherRes.filter(
          (voucher) => !voucherInUser.includes(voucher._id)
        );

        setFreeShipVoucher(freeShipVouchers);
      } else {
        const res = await axios.get("http://localhost:8000/coupon");

        const voucherRes = res.data.data;
        setFreeShipVoucher(voucherRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1400,
  };

  const handleSubmit = async (voucherID) => {
    if (!accessToken) {
      Swal.fire({
        title: "Vui lòng đăng nhập để lưu Voucher!",
        icon: "warning",
      });
      return;
    }

    const userConfirmed = await Swal.fire({
      title: "Xác nhận lưu voucher này?",
      text: "Bạn có muốn tiếp tục không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
    });

    if (userConfirmed.isConfirmed) {
      try {
        await axios.put(
          "http://localhost:8000/user/addCoupon",
          {
            cpid: voucherID,
          },
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          }
        );

        Swal.fire({
          title: "Đã lưu thành công!",
          text: "Voucher đã được lưu thành công.",
          icon: "success",
        });

        fetchData();
      } catch (error) {
        Swal.fire({
          title: "Lỗi",
          text: "Có lỗi xảy ra khi xử lý yêu cầu của bạn.",
          icon: "error",
        });

        console.log(error);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div class="voucher">
      <Slider {...settings}>
        <div class="voucher-slider">
          <img src={sliderVoucher2} alt="SliderVoucher 2" />
        </div>
        <div class="voucher-slider">
          <img src={sliderVoucher1} alt="SliderVoucher 1" />
        </div>
      </Slider>

      <div class="voucher-list">
        {freeShipVoucher.map((voucher, index) => (
          <div key={index} class="voucher-list-container">
            <img src={voucherSV} alt="" />
            <div className="voucher-list-container-information">
              <label>Giảm tối thiểu {voucher.discount}%</label>
              <br />
              <label>Đơn tối thiểu {voucher.exclusive}Đ</label>
              <br />
              <label style={{ color: "red" }}>
                Hết hạn: {new Date(voucher.expiry).toLocaleDateString()}
              </label>{" "}
              <button onClick={() => handleSubmit(voucher._id)}>LƯU</button>
            </div>
          </div>
        ))}
      </div>

      <div className="different-product">
        <h1
          style={{
            fontStyle: "bold",
            textAlign: "left",
            marginTop: "50px",
          }}
        >
          CÓ THỂ BẠN SẼ THÍCH
        </h1>
        <DifferentProduct />
      </div>
    </div>
  );
};
export default MaGiamGiaShop;
