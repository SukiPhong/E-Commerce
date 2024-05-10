import React, { useState, useEffect } from "react";
import LeftMenu from "../LeftMenu";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../service/userSlice";
import "../Styles/SanPhamAdmin.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import InsertLeft from "./InsertLeft";
import Loading from "../../Loading/Loading";

const ThemSanPhamAdmin = () => {
  const accessToken = useSelector(selectAccessToken);
  const Swal = require("sweetalert2");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState([]);
  const [Category, setCategory] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCate, setSelectedCate] = useState("");
  const [htmlDescription, setHtmlDescription] = useState(
    "<p>Hello from CKEditor&nbsp;5!</p>"
  );
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState([
    { size: 36, numberOfSize: 0 },
    { size: 37, numberOfSize: 0 },
    { size: 38, numberOfSize: 0 },
    { size: 39, numberOfSize: 0 },
    { size: 40, numberOfSize: 0 },
    { size: 41, numberOfSize: 0 },
    { size: 42, numberOfSize: 0 },
  ]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchDataCate();
  }, []);

  const fetchDataCate = async () => {
    try {
      const res = await axios.get("http://localhost:8000/Category");
      setCategory(res.data.prodCategory);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/brand");
      setBrand(res.data.Brands);
    } catch (error) {
      console.log(error);
    }
  };
  const handleThemSanPham = async () => {
    if (
      !productName ||
      !htmlDescription ||
      !selectedBrand ||
      !price ||
      !accessToken
    ) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng điền đầy đủ thông tin sản phẩm",
      });
      return;
    }
    const confirmResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn thêm sản phẩm?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", htmlDescription);
    formData.append("brand", selectedBrand);
    formData.append("category", selectedCate);
    formData.append("price", price);
    quantity.forEach((item, index) => {
      formData.append(`quantity[${index}][size]`, item.size);
      formData.append(`quantity[${index}][numberOfSize]`, item.numberOfSize);
    });
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("img", selectedImages[i]);
    }
    try {
      await axios.post("http://localhost:8000/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: `Bearer ${accessToken}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Đã thêm sản phẩm thành công",
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi khi thêm sản phẩm",
        text: error.message || "Đã xảy ra lỗi không xác định",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeBrand = (e) => {
    setSelectedBrand(e.target.value);
  };
  const handleChangeCate = (e) => {
    setSelectedCate(e.target.value);
  };
  const handleSizeChange = (size, value) => {
    const parsedValue = parseInt(value, 10) || 0;
    const updatedSizes = quantity.map((item) =>
      item.size === size ? { ...item, numberOfSize: parsedValue } : item
    );
    setQuantity(updatedSizes);
  };
  const handleImageChange = (event) => {
    const imageFiles = event.target.files;
    setSelectedImages(imageFiles);
  };
  const handleDeleteImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };
  return (
    <div className="main">
      {isLoading && <Loading />}
      <div className="container themsanpham">
        <LeftMenu />
        <div className="right-main">
          <div className="heading-right">
            <h1 className="danh-muc-title">Thêm Sản Phẩm</h1>
          </div>
          <div className="insert-sanpham">
            <InsertLeft
              handleImageChange={handleImageChange}
              selectedImages={selectedImages}
              handleDeleteImage={handleDeleteImage}
            />
            <div className="insertRight">
              <div className="fieldInput">
                <div className="pInsert">
                  <p>- Nhập tên sản phẩm</p>
                  <p style={{ color: "red" }}>*</p>
                  <p>:</p>
                </div>
                <input
                  className="input-danhmuc"
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="fieldInput">
                <div className="pInsert">
                  <p>- Chọn danh mục</p>
                  <p style={{ color: "red" }}>*</p>
                  <p>:</p>
                </div>
                <select
                  className="select-danhmuc"
                  value={selectedCate}
                  onChange={handleChangeCate}
                >
                  <option value="">Chọn Danh Mục</option>
                  {Category.map((cateItem) => (
                    <option key={cateItem._id} value={cateItem._id}>
                      {cateItem.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fieldInput">
                <div className="pInsert">
                  <p>- Chọn nhãn hiệu</p>
                  <p style={{ color: "red" }}>*</p>
                  <p>:</p>
                </div>
                <select
                  className="select-danhmuc"
                  value={selectedBrand}
                  onChange={handleChangeBrand}
                >
                  <option value="">Chọn Nhãn Hiệu</option>
                  {brand.map((brandItem) => (
                    <option key={brandItem._id} value={brandItem._id}>
                      {brandItem.brandName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fieldInput">
                <div className="pInsert">
                  <p>- Nhập giá sản phẩm</p>
                  <p style={{ color: "red" }}>*</p>
                  <p>:</p>
                </div>
                <input
                  className="input-danhmuc"
                  type="number"
                  placeholder="Nhập giá sản phẩm"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="fieldInput">
                <div className="pInsert">
                  <p>- Số lượng sản phẩm</p>
                  <p style={{ color: "red" }}>*</p>
                  <p>:</p>
                </div>
                {quantity.map((sizeItem) => (
                  <div key={sizeItem.size} className="quantityField">
                    <p className="sizeField">{sizeItem.size}</p>
                    <input
                      className="input-quantity"
                      type="number"
                      placeholder="Nhập số lượng"
                      value={sizeItem.numberOfSize}
                      onChange={(e) =>
                        handleSizeChange(sizeItem.size, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="decriptionField">
                <div className="pInsert">
                  <p>- Mô tả sản phẩm</p>
                  <p style={{ color: "red" }}>*</p>
                  <p>:</p>
                </div>
                <CKEditor
                  value={htmlDescription}
                  onChange={(e, editor) => {
                    const data = editor.getData();
                    setHtmlDescription(data);
                  }}
                  editor={ClassicEditor}
                  data="<p>Hello from CKEditor&nbsp;5!</p>"
                />
              </div>
            </div>
          </div>

          <div className="bottom">
            <button className="save-btn" onClick={handleThemSanPham}>
              THÊM SẢN PHẨM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemSanPhamAdmin;
