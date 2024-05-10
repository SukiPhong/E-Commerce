import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Sliders.css";

const DifferentProduct = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliderRef, setSliderRef] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProductsResponse = await axios.get(
          "http://localhost:8000/product"
        );
        const allProducts = allProductsResponse.data.productDatas;
        setProductData(allProducts);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const goToNext = () => {
    sliderRef.slickNext();
  };

  const goToPrev = () => {
    sliderRef.slickPrev();
  };

  const handleProductClick = () => {
    window.location.reload();
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider-product-cart">
      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : productData.length > 0 ? (
        <Slider {...settings} ref={(slider) => setSliderRef(slider)}>
          {productData.map((product) => (
            <div
              key={product._id}
              className="slider-product-cart-bottom"
              onClick={handleProductClick}
            >
              <Link
                to={`/chitietsanpham/${product._id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <img src={product.images[0]} alt={product.productName} />
                <h3>{product.productName}</h3>
                <p>Giá: {product.price} VNĐ</p>
              </Link>
            </div>
          ))}
        </Slider>
      ) : (
        <p>Không có sản phẩm để hiển thị</p>
      )}
      <div className="slider-product-cart-move">
        <button className="btn-left" onClick={goToPrev}>
          <FontAwesomeIcon icon={faAngleLeft} size="lg" color="black" />
        </button>

        <button className="btn-right" onClick={goToNext}>
          <FontAwesomeIcon icon={faAngleRight} size="lg" color="black" />
        </button>
      </div>
    </div>
  );
};

export default DifferentProduct;
