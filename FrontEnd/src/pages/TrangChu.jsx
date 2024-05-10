import React, { useState, useEffect } from "react";
import ImageSlider from "../component/Slider/Sliders";
import Images from "../component/Slider/Images";
import ImageCollection from "../component/Slider/ImageCollection";
import Loading from "../component/Loading/Loading";
import DifferentProduct from "../component/Slider/DifferentProduct";

const TrangChu = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      localStorage.removeItem("cart");
      localStorage.removeItem("cartList");
    }, 1500);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <ImageSlider />
      <div>
        <Images />
      </div>
      <div>
        <ImageCollection />
      </div>
      <>
        <div className="different-product">
          <h1
            style={{
              fontStyle: "bold",
              textAlign: "left",
              marginTop: "50px",
              textAlignLast: "center",
            }}
          >
            CÓ THỂ BẠN SẼ THÍCH
          </h1>
          <DifferentProduct />
        </div>
      </>
    </div>
  );
};

export default TrangChu;
