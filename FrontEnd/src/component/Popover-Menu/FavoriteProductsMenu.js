import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FavoriteMenu.css";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../service/userSlice";
import { getUserFavorites, getAllProducts } from "../../service/api";

const FavoriteProductsMenu = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const favorites = await getUserFavorites(accessToken);
        const allProductsData = await getAllProducts();

        setFavoriteProducts(favorites);
        setAllProducts(allProductsData);
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

  const displayedProducts = allProducts
    ? allProducts
        .filter((product) => favoriteProducts.includes(product._id))
        .slice(0, 4)
    : [];

  return (
    <div className="favorite-products-menu">
      {favoriteProducts.length === 0 ? (
        <div className="no-favorite">
          {isLoading ? (
            <>Loading...</>
          ) : (
            <span>Bạn chưa yêu thích sản phẩm.</span>
          )}
        </div>
      ) : (
        <ul>
          <h1>Sản Phẩm Yêu Thích</h1>
          {displayedProducts.map((product) => (
            <Link
              key={product._id}
              style={{ textDecoration: "none" }}
              to={`/chitietsanpham/${product._id}`}
            >
              <li>
                <div className="imgName">
                  <img src={product.images[0]} alt={product.name} />
                  <p
                    className="namePro"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                  >
                    {product.productName}
                  </p>
                </div>
                <p
                  className="pricePro"
                  style={{ color: "red", textDecoration: "underline" }}
                >
                  {product.price}&#8363;
                </p>{" "}
              </li>
            </Link>
          ))}
        </ul>
      )}

      <Link to="/thongtin/yeuthich" className="btn-all-favorite-pro">
        Xem tất cả
      </Link>
    </div>
  );
};

export default FavoriteProductsMenu;
