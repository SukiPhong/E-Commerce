import React, { useState, useEffect } from "react";
import "../Styles/EditSanPham.css";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../service/userSlice";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useParams } from "react-router-dom";

const EditSanPham = () => {
  const accessToken = useSelector(selectAccessToken);
  const Swal = require("sweetalert2");
  const { productId } = useParams();
  const [quantity, setQuantity] = useState([
    { size: 36, numberOfSize: 0 },
    { size: 37, numberOfSize: 0 },
    { size: 38, numberOfSize: 0 },
    { size: 39, numberOfSize: 0 },
    { size: 40, numberOfSize: 0 },
    { size: 41, numberOfSize: 0 },
    { size: 42, numberOfSize: 0 },
  ]);
  const [imgProduct, setImgProduct] = useState([]);
  const [productEdit, setProductEdit] = useState({
    productName: "",
    price: "",
    quantity: quantity,
    description: "",
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/product/");
        const productData = res.data.productDatas;

        if (productData && productData.length > 0) {
          const specificProduct = productData.find(
            (product) => product._id === productId
          );
          if (specificProduct) {
            setProductEdit(specificProduct);
            setImgProduct(specificProduct.images);
            setQuantity(specificProduct.quantity);
          } else {
            console.error("Không tìm thấy sản phẩm với ID tương ứng");
          }
        } else {
          console.error("Không tìm thấy sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSizeChange = (size, value) => {
    const parsedValue = parseInt(value, 10) || 0;

    // Update the quantity state immutably using spread operator
    setProductEdit((prevProductEdit) => {
      const updatedQuantity = prevProductEdit.quantity.map((item) =>
        item.size === size ? { ...item, numberOfSize: parsedValue } : item
      );

      return {
        ...prevProductEdit,
        quantity: updatedQuantity,
      };
    });
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    if (
      !productEdit.productName ||
      !productEdit.description ||
      !productEdit.price ||
      !accessToken
    ) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng điền đầy đủ thông tin sản phẩm",
      });
      return;
    }
    const formData = new FormData();
    formData.append("productName", productEdit.productName);
    formData.append("description", productEdit.description);
    formData.append("price", productEdit.price);
    productEdit.quantity.forEach((item, index) => {
      formData.append(`quantity[${index}][size]`, item.size);
      formData.append(`quantity[${index}][numberOfSize]`, item.numberOfSize);
    });
    for (let i = 0; i < productEdit.images.length; i++) {
      formData.append("img", productEdit.images[i]);
    }
    try {
      await axios.put(`http://localhost:8000/product/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: `Bearer ${accessToken}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Đã chỉnh sửa sản phẩm thành công",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleImageChange = (index, event) => {
    const files = event.target.files[0];

    if (files.length > 0) {
      const updatedImgProduct = [...imgProduct];
      const imageURL = URL.createObjectURL(files[0]);
      updatedImgProduct[index] = imageURL;
      setImgProduct(updatedImgProduct);
    }
  };

  return (
    <div className="formEditSanPham">
      <Link className="backtopage" to="/danhsachsanphamadmin">
        <ArrowBackIcon />
        Trở Lại
      </Link>
      <div className="main-content">
        <div className="header">
          <h1>SỬA SẢN PHẨM</h1>
        </div>
        <div className="contentEdit">
          <div className="left-content">
            <div className="pInsert">
              <p>- Hình ảnh sản phẩm: </p>
            </div>
            <div className="imgEdit">
              {Array.isArray(imgProduct) &&
                imgProduct.length > 0 &&
                imgProduct.map((img, index) => (
                  <div key={index} className="imgEditField">
                    <img
                      key={index}
                      src={img}
                      alt={`Product ${productEdit.productName} Image ${
                        index + 1
                      }`}
                    />
                    <div className="editOverlay">
                      <label htmlFor={`fileInput${index}`}>Chỉnh sửa ảnh</label>
                      <input
                        type="file"
                        id={`fileInput${index}`}
                        onChange={(e) => handleImageChange(index, e)}
                        accept="image/*"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="right-content">
            <div className="fieldInput">
              <div className="pInsert">
                <p>- Tên sản phẩm: </p>
              </div>
              <input
                className="input-danhmuc"
                type="text"
                placeholder="Nhập tên sản phẩm"
                value={productEdit.productName}
                onChange={(e) =>
                  setProductEdit({
                    ...productEdit,
                    productName: e.target.value,
                  })
                }
              />
            </div>
            <div className="fieldInput">
              <div className="pInsert">
                <p>- Giá sản phẩm: </p>
              </div>
              <input
                className="input-danhmuc"
                type="number"
                placeholder="Nhập giá sản phẩm"
                value={productEdit.price}
                onChange={(e) =>
                  setProductEdit({
                    ...productEdit,
                    price: e.target.value,
                  })
                }
              />
            </div>
            <div className="fieldInput">
              <div className="pInsert">
                <p>- Số lượng sản phẩm</p>
              </div>
              {quantity.map((sizeItem) => (
                <div key={sizeItem.size} className="quantityField">
                  <p className="sizeField">{sizeItem.size}</p>
                  <input
                    className="input-quantity"
                    type="number"
                    placeholder="Nhập số lượng"
                    value={
                      productEdit.quantity.find(
                        (item) => item.size === sizeItem.size
                      )?.numberOfSize || 0
                    }
                    onChange={(e) =>
                      handleSizeChange(sizeItem.size, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="decriptionField">
          <div className="pInsert">
            <p>- Mô tả sản phẩm</p>
            <p style={{ color: "red" }}>*</p>
            <p>:</p>
          </div>
          <CKEditor
            value={productEdit.description}
            editor={ClassicEditor}
            data={productEdit.description}
            onChange={(e, editor) => {
              const data = editor.getData();
              setProductEdit({ ...productEdit, description: data });
            }}
          />
        </div>
        <div className="btnEditField">
          <button onClick={handleSaveEdit} className="btnEdit">
            {isSaving ? "Đang Lưu......." : "Lưu Thay Đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSanPham;
