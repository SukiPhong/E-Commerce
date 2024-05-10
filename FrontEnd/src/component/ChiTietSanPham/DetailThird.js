import React, { useEffect, useState } from "react";
import GradeIcon from "@mui/icons-material/Grade";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import WriteRating from "./WriteRating";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../service/userSlice";
import CustomSnackbar from "../Snakbar/CustomSnackbar";
import "react-image-lightbox/style.css";
import CommentItem from "./CommentItem";

const DetailThird = ({ product }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRating, setSelectedRating] = useState("Tất cả");
  const [openRating, setOpen] = React.useState(false);
  const [totalRating, setToltalRating] = useState(null);
  const [productRating, setProductRating] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const idProduct = product._id;
  const [commentCounts, setCommentCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const accessToken = useSelector(selectAccessToken);
  const [value, setValue] = useState(1);
  const [textValue, setTextValue] = useState("");
  const open = Boolean(anchorEl);
  const [openSnackBar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [messageServerity, setMessageServerity] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const Swal = require("sweetalert2");

  const handleOpenSnackbar = (message, severity) => {
    setMessage(message);
    setMessageServerity(severity);
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const fetchData = async () => {
    try {
      const productResponse = await axios.get(
        `http://localhost:8000/product?_id=${idProduct}`
      );

      if (accessToken) {
        const userResponse = await axios.get("http://localhost:8000/user", {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        });
        const arrayUser = userResponse.data.user;
        const arrayUserRating =
          productResponse.data.productDatas[0]?.ratings || [];

        const commonIds = arrayUser.filter((user) => {
          return arrayUserRating.some((rating) => rating.postedBy === user._id);
        });

        const productRatings = arrayUserRating.slice();
        commonIds.forEach((user) => {
          const correspondingRating = productRatings.find(
            (rating) => rating.postedBy === user._id
          );
          if (correspondingRating) {
            correspondingRating.username = user.username;
            correspondingRating.Avatar = user.Avatar;
          }
        });

        setProductRating(productRatings);
        const totalRatings =
          productResponse.data.productDatas[0]?.totalRatings || 0;
        setToltalRating(totalRatings);
        const newCommentCounts = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };
        productRatings.forEach((ratings) => {
          newCommentCounts[ratings.star]++;
        });
        setCommentCounts(newCommentCounts);
        setSelectedRating("Tất cả");
        setSelectedComments(productRatings);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [accessToken, idProduct]);
  const handleSave = async (setSaving) => {
    setSaving(true);

    if (selectedImages.length > 3) {
      handleOpenSnackbar("Bạn chỉ được chọn tối đa 3 file.", "error");
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("pid", idProduct);
    formData.append("star", value);
    formData.append("comment", textValue);
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("img", selectedImages[i]);
    }

    try {
      await axios.post("http://localhost:8000/product/rating", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: `Bearer ${accessToken}`,
        },
      });
      setOpen(false);
      Swal.fire({
        icon: "success",
        title: "Bạn đã đánh giá sản phẩm",
        text: "Xin chân thành cảm ơn bạn!",
      });
      fetchData();
    } catch (error) {
      console.error("Error while calling API:", error);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleClickOpen = () => {
    if (!accessToken) {
      Swal.fire({
        icon: "info",
        title: "Bạn Chưa Đăng Nhập",
        text: "Hãy đăng nhập để xem đánh giá",
      });
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  const handleCloseOpen = () => {
    setOpen(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRatingSelect = (rating) => {
    setAnchorEl(null);
    setSelectedRating(rating);

    if (rating !== "Tất cả") {
      const filteredComments = productRating.filter(
        (item) => item.star === rating
      );
      setSelectedComments(filteredComments);
    } else {
      setSelectedComments(productRating);
    }
  };

  return (
    <div className="detailThird">
      <div className="third-left">
        <h1>ĐÁNH GIÁ</h1>
        <p className="totalRatings">
          {totalRating} / 5{" "}
          <GradeIcon sx={{ fontSize: "4rem", color: "#FFC10A" }} />
        </p>
        <div
          className="valueRating"
          style={{
            width: "100%",
          }}
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="value-rating">
              <p style={{ fontSize: "1.6rem" }}>{rating} Sao</p>
              <Rating
                name="read-only"
                sx={{
                  width: "50%",
                  fontSize: "3.5rem",
                }}
                value={rating}
                readOnly
              />
              <p style={{ fontSize: "1.6rem" }}>({commentCounts[rating]})</p>
            </div>
          ))}
        </div>

        <Button
          onClick={handleClickOpen}
          className="btn-rating"
          sx={{ backgroundColor: "#F19E50", color: "white" }}
        >
          VIẾT ĐÁNH GIÁ
        </Button>
        <WriteRating
          open={openRating}
          handleClose={handleCloseOpen}
          handleSave={handleSave}
          value={value}
          textValue={textValue}
          setValue={setValue}
          setTextValue={setTextValue}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          saving={saving}
          setSaving={setSaving}
        />
      </div>
      <div className="third-right">
        <div className="third-right-top">
          <span> {`Tất cả đánh giá (${selectedComments.length})`}</span>
          <div className="rank">
            <span>Xếp hạng: </span>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              className="btn-rank"
            >
              {selectedRating}
              <GradeIcon sx={{ color: "#FFC10A" }} />{" "}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {["Tất cả", 1, 2, 3, 4, 5].map((rating) => (
                <MenuItem
                  className="menu-item-rating"
                  sx={{ backgroundColor: "white" }}
                  key={rating}
                  onClick={() => handleRatingSelect(rating)}
                >
                  <div className="filter-rating">
                    <p style={{ margin: "5px", width: "100%" }}>{rating}</p>
                    <GradeIcon sx={{ color: "#FFC10A" }} />{" "}
                  </div>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
        <div className="third-right-bottom">
          {selectedComments.length > 0 ? (
            selectedComments
              .slice()
              .reverse()
              .map((productRating) => (
                <CommentItem
                  key={productRating._id}
                  productRating={productRating}
                />
              ))
          ) : (
            <div>
              {!accessToken ? (
                <h1 style={{ textAlign: "center", margin: "20px" }}>
                  Bạn chưa đăng nhập
                </h1>
              ) : (
                <h1 style={{ textAlign: "center", margin: "20px" }}>
                  Không có đánh giá
                </h1>
              )}
            </div>
          )}
        </div>
      </div>
      <CustomSnackbar
        open={openSnackBar}
        handleClose={handleCloseSnackbar}
        message={message}
        severity={messageServerity}
      />
    </div>
  );
};

export default DetailThird;
