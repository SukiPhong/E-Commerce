import React from "react";
import leftimagebottom from "../../assets/leftimagebottom.png";
import middleimagebottom from "../../assets/middleimagebottom.png";
import rightimagebottom from "../../assets/rightimagebottom.png";
import "./Images.css";
import { Link } from "react-router-dom";
const ImageCollection = () => {
  return (
    <div className="Image-collection">
      <div className="Image-collection-left">
        <img src={leftimagebottom} alt="" />
      </div>
      <div className="Image-collection-middle">
        <Link>Bộ sưu tập</Link>
        <br />
        <img src={middleimagebottom} alt="" />
      </div>
      <div className="Image-collection-right">
        <img src={rightimagebottom} alt="" />
      </div>
    </div>
  );
};

export default ImageCollection;
