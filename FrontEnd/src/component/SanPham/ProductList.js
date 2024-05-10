import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken } from "../../service/userSlice";
import SortMain from "./SortMain";

const marks = [
  {
    value: 0,
  },
  {
    value: 1000000,
  },
  {
    value: 2000000,
  },
  {
    value: 3000000,
  },
  {
    value: 4000000,
  },
  {
    value: 5000000,
  },
];

function valuetext(value) {
  return `${value} Đ`;
}

const ProductList = ({
  sanPhamTrenTrangHienTai,
  brands,
  checkBrand,
  FilterBrand,
  FilterPrice,
  addFavorite,
  loadingPage,
  currentSort,
  showFilterOptions,
  toggleFilterOptions,
  handleSort,
  productCountsByBrand,
}) => {
  const [value, setValue] = useState([0, 5000000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    FilterPrice(newValue);
  };

  return (
    <div className="product-main">
      <div className="filter-products">
        <h1>Bộ lọc</h1>
        <SortMain
          currentSort={currentSort}
          showFilterOptions={showFilterOptions}
          toggleFilterOptions={toggleFilterOptions}
          handleSort={handleSort}
        />
        <div className="filter-boloc">
          <Box
            sx={{
              width: "100%",
              padding: "2rem",
              borderRadius: "10px",
              "& .MuiSlider-thumb": {
                backgroundColor: "#FB5731",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#FB5731",
              },
              "& .MuiSlider-track": {
                backgroundColor: "#FB5731",
              },
            }}
          >
            <div className="label-price">
              <h3>Theo Giá: </h3>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                  backgroundColor: "white",
                  textAlign: "center",
                  width: "65%",
                }}
                id="non-linear-slider"
                gutterBottom
              >
                {valuetext(value[0])} đến {valuetext(value[1])}
              </Typography>
            </div>
            <Slider
              aria-label="Price"
              value={value}
              onChange={handleChange}
              step={1000000}
              min={0}
              max={5000000}
              marks={marks}
              valueLabelFormat={valuetext}
              className="thumbnail"
            />
          </Box>
        </div>
        <div className="filter-boloc-brand">
          <h3>Theo Nhãn Hiệu</h3>
          <div className="filter-options-brand">
            <ul>
              {brands && brands.length > 0 ? (
                brands.map((brand) => (
                  <label className="lable-container" key={brand._id}>
                    <div className="lableInput">
                      <input
                        type="checkbox"
                        value={brand._id}
                        checked={checkBrand.includes(brand._id)}
                        onChange={() => FilterBrand(brand._id)}
                      />
                      <div className="checkmark"></div>
                      <p>{brand.brandName}</p>
                    </div>
                    <p>({productCountsByBrand[brand._id] || 0})</p>
                  </label>
                ))
              ) : (
                <p>Không có thương hiệu nào</p>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="productList">
        <ul className="productList">
          {sanPhamTrenTrangHienTai && sanPhamTrenTrangHienTai.length > 0 ? (
            sanPhamTrenTrangHienTai
              .reverse()
              .map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  addFavorite={addFavorite}
                />
              ))
          ) : (
            <div style={{ width: "100%", height: "100%" }}>
              {loadingPage ? (
                <h1 style={{ textAlign: "center", fontSize: "3rem" }}>
                  Đang tải......
                </h1>
              ) : (
                <h1 style={{ textAlign: "center", fontSize: "3rem" }}>
                  Không có sản phẩm nào
                </h1>
              )}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

const ProductItem = ({ product, addFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user/current", {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        });
        const favorites = res.data.user.Favorites;
        const isProductInFavorites = favorites.some(
          (favorite) => favorite === product._id
        );
        setIsFavorite(isProductInFavorites);
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
      }
    };
    if (accessToken) {
      fetchData();
    }
  }, [accessToken, dispatch, product._id]);

  const handleAddFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    addFavorite(product._id);
  };

  return (
    <>
      <li className="product-item" onClick={(e) => e.stopPropagation()}>
        <Link
          to={`/chitietsanpham/${product._id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <img
            className="imgMain"
            src={product.images[0]}
            alt={product.productName}
          />

          <h3
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {product.productName}
          </h3>
          <p>Giá: {product.price.toLocaleString()} VNĐ</p>
        </Link>
        <button className="icon-favorite" onClick={handleAddFavorite}>
          <FontAwesomeIcon
            icon={isFavorite ? faHeartSolid : faHeart}
            style={{ color: isFavorite ? "red" : "black" }}
          />
        </button>
      </li>
    </>
  );
};

export default ProductList;
