import React from "react";
import "../../Styles/productDetailThird.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

const labels = {
  1: "Rất Tệ",
  2: "Tệ",
  3: "Tốt",
  4: "Rất Tốt",
  5: "Xuất sắc",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const WriteRating = ({
  open,
  handleClose,
  handleSave,
  setValue,
  setTextValue,
  value,
  textValue,
  selectedImages,
  setSelectedImages,
  saving,
  setSaving,
}) => {
  const handleImageChange = (event) => {
    const imageFiles = event.target.files;
    setSelectedImages(Array.from(imageFiles));
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  return (
    <Dialog
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onClose={handleClose}
      open={open}
    >
      <DialogContent
        sx={{
          width: "100%",
          backgroundColor: "#F4EBDD",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          className="text-rating"
          variant="h4"
          sx={{
            textAlign: "center",
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          BẠN CÓ THÍCH SẢN PHẨM CỦA CHÚNG TÔI?
        </Typography>
        <div className="rating-product-quality">
          <Typography className="text-rating" variant="h6">
            Chất Lượng Sản Phẩm
          </Typography>
          <Rating
            name="hover-feedback"
            value={value}
            precision={1}
            getLabelText={getLabelText}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            sx={{ fontSize: "3.5rem", margin: "10px" }}
            emptyIcon={
              <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
            }
          />
        </div>
        <div
          className="FieldAutosize"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <textarea
            className="text-autosize"
            placeholder="Viết đánh giá của bạn..."
            value={textValue}
            onChange={(event) => setTextValue(event.target.value)}
          ></textarea>
        </div>

        <div className="insert">
          <div style={{ float: "left" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="image-upload"
              multiple
            />
            <label className="image-upload" htmlFor="image-upload">
              <IconButton className="icon-up" component="span">
                <PhotoCameraIcon /> Thêm hình ảnh
              </IconButton>
            </label>
          </div>
          {Array.isArray(selectedImages) && selectedImages.length > 0 && (
            <div
              style={{ display: "flex" }}
              className="selected-images-container"
            >
              {selectedImages.map((image, index) => (
                <div key={index} className="selected-image-item">
                  <img
                    style={{ width: "100px" }}
                    src={URL.createObjectURL(image)}
                    alt=""
                  />
                  <IconButton
                    className="delete-image-icon"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#F4EBDD",
        }}
        className="rating-actions"
      >
        <Button className="btn-rating-exit" autoFocus onClick={handleClose}>
          Thoát
        </Button>
        <Button
          className="btn-rating-save"
          autoFocus
          onClick={() => handleSave(setSaving)}
          disabled={saving}
        >
          {saving ? "Đang gửi..." : "Hoàn Thành"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WriteRating;
