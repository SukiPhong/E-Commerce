import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Sliders.css";
const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1400,
  };

  return (
    <Slider {...settings}>
      <div id="slidercss">
        <img
          src="https://d13xymm0hzzbsd.cloudfront.net/1/20210909/16312244820236.png"
          alt="Slide 1"
        />
      </div>
      <div id="slidercss">
        <img
          src="https://misskick.vn/wp-content/uploads/2022/02/5125-1.jpg"
          alt="Slide 2"
        />
      </div>
      <div id="slidercss">
        <img
          src="https://uproxx.com/wp-content/uploads/2021/03/MSCHF_Satan_Shoes_Feat-1.jpg?w=1600&h=510&crop=1"
          alt="Slide 3"
        />
      </div>
      <div id="slidercss">
        <img
          src="https://file.hstatic.net/200000278317/file/kham-pha-lich-su-cac-doi-giay-da-banh-air-zoom-cua-nike-1_3cb3b7345e334462a0c8ac1940c879cf.jpg"
          alt="Slide 4"
        />
      </div>
      <div id="slidercss">
        <img
          src="https://thieuhoa.com.vn/wp-content/uploads/2022/12/NAn1z3NEJuOI6YJLgmb3dkODbfmxtfZKDJH1mg0v.webp"
          alt="Slide 5"
        />
      </div>
    </Slider>
  );
};

export default ImageSlider;
