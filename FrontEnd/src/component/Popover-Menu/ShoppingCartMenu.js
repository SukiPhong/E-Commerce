import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../service/userSlice";
import { getCart } from "../../service/api";
import "./ShoppingCartMenu.css";

const ShoppingCartMenu = () => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const cartList = await getCart(accessToken);
        setShoppingCart(cartList);
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);


  return (
    <div className="shoppingcart-products-menu">
      {shoppingCart.length === 0 ? (
        <div className="no-favorite">
          {isLoading ? <>Loading...</> : <span>Giỏ Hàng Trống.</span>}
        </div>
      ) : (
        <ul>
          <h1>Giỏ Hàng</h1>
          {shoppingCart.slice(0, 5).map((cart) => (
            <Link key={cart._id} style={{ textDecoration: "none" }}>
              <li>
                <div className="imgName">
                  <img src={cart.img} alt={cart.name} />
                  <div className="imgNametop">
                    <p
                      className="namePro"
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: "200px",
                      }}
                    >
                      {cart.name}
                    </p>
                    <p style={{ color: "black" }}>
                      size: {cart.size}, số lượng: {cart.count} đôi
                    </p>
                  </div>
                </div>
                <p
                  className="pricePro"
                  style={{ color: "red", textDecoration: "underline" }}
                >
                  {cart.price}&#8363;
                </p>{" "}
              </li>
            </Link>
          ))}
        </ul>
      )}

      <Link to="/giohang" className="btn-all-favorite-pro">
        Xem tất cả
      </Link>
    </div>
  );
};

export default ShoppingCartMenu;
