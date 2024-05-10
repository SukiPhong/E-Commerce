import React, { useState, useEffect } from "react";
import "./ThongTinNguoiDung.css";
import { Link } from "react-router-dom";
import ControlInfor from "./ControlInfor";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken } from "../../../service/userSlice";

const YeuThich = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [favoritesResponse, allProductsResponse] = await Promise.all([
          axios.get("http://localhost:8000/user/current", {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          }),
          axios.get("http://localhost:8000/product"),
        ]);

        const favorites = favoritesResponse.data.user.Favorites;
        const allProductsData = allProductsResponse.data.productDatas;

        setFavoriteProducts(favorites);
        setAllProducts(allProductsData);
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken, dispatch]);

  const displayedProducts = allProducts
    ? allProducts.filter((product) => favoriteProducts.includes(product._id))
    : [];
  return (
    <div className="container-thongtin">
      <ControlInfor />
      <div className="content-infor">
        {favoriteProducts.length === 1 ? (
          <div className="no-favorite">
            <span>Bạn chưa yêu thích sản phẩm.</span>
          </div>
        ) : (
          <ul className="ul-favorite">
            {displayedProducts.map((product) => (
              <Link
                key={product._id}
                style={{ textDecoration: "none" }}
                to={`/chitietsanpham/${product._id}`}
              >
                <li className="li-favorite">
                  <div className="imgName">
                    <img src={product.images[0]} alt={product.name} />
                  </div>
                  <div className="info-favorite">
                    <p
                      className="namePro"
                      style={{
                        fontSize: "2.5rem",
                      }}
                    >
                      {product.productName}
                    </p>
                    <p
                      className="pricePro"
                      style={{
                        fontSize: "2rem",
                        color: "red",
                        textDecoration: "underline",
                      }}
                    >
                      {product.price}&#8363;
                    </p>{" "}
                  </div>
                  <div className="more-product">
                    <Link to={`/chitietsanpham/${product._id}`}>
                      Xem chi tiết
                    </Link>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default YeuThich;
