import React, { useEffect, useState } from "react";
import "../Styles/GioHang.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../service/userSlice";
import DifferentProduct from "../component/Slider/DifferentProduct";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../component/GioHang/CartItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Loading from "../component/Loading/Loading";
import { getDeleteAllCartUser } from "../service/api";
import { Button } from "@mui/material";

const GioHang = () => {
  const accessToken = useSelector(selectAccessToken);
  const [cartList, setCartList] = useState([]);
  const Swal = require("sweetalert2");
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const isCartEmpty = cartList.length === 0;
  const navigate = useNavigate();

  const fetchUserCurrent = async () => {
    try {
      if (!accessToken) {
        return;
      }
      const res = await axios.get("http://localhost:8000/user/current/", {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      });
      const userCart = res.data.user.Cart;
      setCartList(res.data.user.Cart);
      const total = userCart.reduce(
        (acc, cartItem) => acc + cartItem.price * cartItem.count,
        0
      );
      setTotalPrice(total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  useEffect(() => {
    if (accessToken) {
      localStorage.removeItem("cartList");
      fetchUserCurrent();
    }
  }, [accessToken]);
  const handleDeleteAllProducts = async () => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa tất cả?",
        text: "Tất cả sản phẩm sẽ bị xóa khỏi giỏ hàng!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
      });
      if (result.isConfirmed) {
        await getDeleteAllCartUser(accessToken);
        Swal.fire({
          title: "Đã Xóa Tất Cả Thành Công!!!",
          icon: "success",
        });
        localStorage.removeItem("cartList");
        fetchUserCurrent();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleThanhToan = () => {
    if (!accessToken) {
      Swal.fire({
        title: "BẠN CHƯA ĐĂNG NHẬP",
        icon: "info",
      });
      return;
    }
    if (isCartEmpty) {
      Swal.fire({
        title: "BẠN CHƯA THÊM SẢN PHẨM VÀO GIỎ HÀNG",
        icon: "info",
      });
      return;
    }
    navigate("/thanhtoan");
  };
  const handleDeleteProduct = async (productID, size) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Sản phẩm sẽ bị xóa khỏi giỏ hàng!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `http://localhost:8000/user/Cart/${productID}/${size}`,
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          }
        );
        Swal.fire({
          title: "Đã Xóa Thành Công!!!",
          icon: "success",
        });
        localStorage.removeItem("cartList");
        fetchUserCurrent();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleQuantityChange = (e, productID, size) => {
    const updatedCartList = cartList.map((cart) => {
      if (cart.product === productID && cart.size === size) {
        return { ...cart, count: e.target.value };
      }
      return cart;
    });
    setCartList(updatedCartList);
  };
  const updateCartQuantityOnServer = async (productID, size, newCount) => {
    try {
      await axios.put(
        `http://localhost:8000/user/Cart/`,
        {
          pid: `${productID}`,
          size: `${size}`,
          count: newCount,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );
      Swal.fire({
        title: "Thành Công",
        icon: "success",
      });
      fetchUserCurrent();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="giohang">
      <div className="headerCart">
        <ShoppingCartIcon className="iconHeaderCart" />
        <h1>GIỎ HÀNG</h1>
      </div>
      <div className="cartField">
        <div className="cart1">
          <div className="cart1Left">
            <p style={{ fontWeight: "bold" }}>
              Sản Phẩm ({cartList.length} sản phẩm)
            </p>
          </div>
          <div className="cart1Right">
            <p style={{ fontWeight: "bold" }}>Số Lượng</p>
            <p style={{ fontWeight: "bold" }}>Giá Tiền</p>
            <div className="p">
              <button
                className="btnDeleteAll"
                onClick={handleDeleteAllProducts}
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
        {accessToken ? (
          <div className="cartList">
            {cartList.length > 0 ? (
              cartList.map((cart, index) => (
                <CartItem
                  key={index}
                  cart={cart}
                  updateCartQuantityOnServer={updateCartQuantityOnServer}
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                  onDeleteProduct={() =>
                    handleDeleteProduct(cart.product, cart.size)
                  }
                  onQuantityChange={(e) =>
                    handleQuantityChange(e, cart.product, cart.size)
                  }
                />
              ))
            ) : (
              <div className="no-cart">
                <ShoppingCartIcon sx={{ fontSize: "15rem" }} />
                <h1>Giỏ hàng bạn đang trống</h1>

                <Link className="productPage" to="/sanpham">
                  MUA NGAY
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="cartList">
            <div className="no-cart">
              <h1>Bạn chưa đăng nhập</h1>
              <Link className="productPage" to="/login-register">
                ĐĂNG NHẬP ĐỂ MUA SẢN PHẨM
              </Link>
            </div>
          </div>
        )}

        <div className="cartLast">
          <div className="cart1Left"></div>

          <div className="cart1Right">
            <Button
              className="payCart"
              sx={{
                marginRight: "20px",
                backgroundColor: "#ee4d2d",
                color: "white",
                fontSize: "2rem",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#ee4d2d",
                },
              }}
              onClick={handleThanhToan}
            >
              MUA HÀNG
            </Button>
          </div>
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
    </div>
  );
};

export default GioHang;
