import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import LightboxComponent from "../Lightbox/LightboxComponent";
import format from "date-fns/format";
import viLocale from "date-fns/locale/vi";

const CommentItem = ({ productRating }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const formattedDate = format(
    new Date(productRating.dateCMT),
    "dd, MMMM, yyyy HH:mm",
    { locale: viLocale }
  );

  const handleImageClick = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const getStatus = (star) => {
    const statusMapping = {
      1: "Rất Tệ",
      2: "Tệ",
      3: "Tốt",
      4: "Rất Tốt",
      5: "Xuất Sắc",
    };
    return statusMapping[star] || "";
  };

  return (
    <div className="usesComment" key={productRating._id}>
      <div className="img-name-rating">
        <Avatar
          sx={{ border: "1px solid black" }}
          alt=""
          src={productRating.Avatar}
        />
        <div className="name-rating">
          <p>
            {productRating.username} - ngày {formattedDate}
          </p>
          <div
            className="value-rating-user"
            style={{ display: "flex", margin: "2px" }}
          >
            <Rating name="read-only" value={productRating.star} readOnly />
            <p style={{ marginLeft: "5px" }}>
              {" "}
              - {getStatus(productRating.star)}
            </p>
          </div>
        </div>
      </div>
      <div className="comment-user">
        <p style={{ fontSize: "1.2rem" }}>{productRating.comment}</p>
      </div>
      <div className="imgDecription">
        {productRating.feedback_Image.map((img, index) => (
          <img
            style={{ width: "100px", height: "130px", margin: "20px" }}
            key={index}
            alt=""
            src={img}
            onClick={() => handleImageClick(index)}
            className="imgRating"
          />
        ))}
      </div>
      {isOpen && (
        <LightboxComponent
          images={productRating.feedback_Image}
          photoIndex={photoIndex}
          isOpen={isOpen}
          handleClose={() => setIsOpen(false)}
          handlePrev={() =>
            setPhotoIndex(
              (photoIndex + productRating.feedback_Image.length) %
                productRating.feedback_Image.length
            )
          }
          handleNext={() =>
            setPhotoIndex(
              (photoIndex + 1) % productRating.feedback_Image.length
            )
          }
        />
      )}
    </div>
  );
};

export default CommentItem;
