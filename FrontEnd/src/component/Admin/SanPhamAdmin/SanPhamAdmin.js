import React, { useState, useEffect } from "react";
import LeftMenu from "../LeftMenu";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../Styles/DanhMuc.css";
import { useSelector } from "react-redux";
import { selectAdmin, selectAccessToken } from "../../../service/userSlice";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const SanPhamAdmin = () => {
  const [SanPhamData, setSanPhamData] = useState([]);
  const [BrandData, setBrandData] = useState([]);
  const admin = useSelector(selectAdmin);
  const [currentPage, setCurrentPage] = useState(1);
  const accessToken = useSelector(selectAccessToken);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const checkedCount = SanPhamData.filter(
    (sanphamadmin) => sanphamadmin.selected
  ).length;
  const isButtonActive = checkedCount >= 2 && admin;
  const [open, setOpen] = React.useState(false);
  const [notification, setNotification] = useState(null);
  const [sanPhamToDelete, setSanPhamToDelete] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  const handleClickOpen = (sanphamadmin) => {
    setOpen(true);
    setSanPhamToDelete(sanphamadmin);
  };
  const handleClose = () => {
    setOpen(false);
    setSanPhamToDelete(null);
  };
  useEffect(() => {
    fetchData();
    fetchBrands();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/product");
      const fetchedProducts = response.data.productDatas;
      if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
        setSanPhamData(
          fetchedProducts.reverse().map((sanphamadmin) => ({
            ...sanphamadmin,
            selected: false,
          }))
        );
      } else {
        console.log("Không có dữ liệu sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu từ API:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8000/brand");
      const fetchedBrands = response.data.Brands;
      if (Array.isArray(fetchedBrands) && fetchedBrands.length > 0) {
        setBrandData(fetchedBrands);
      } else {
        console.log("Không có dữ liệu thương hiệu.");
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thương hiệu từ API:", error);
    }
  };
  const getBrandName = (_id) => {
    const brand = BrandData.find((Brands) => Brands._id === _id);
    return brand ? brand.brandName : "Không xác định";
  };

  const handleDelete = async (_id) => {
    if (admin) {
      try {
        await axios.delete(`http://localhost:8000/product/${_id}`, {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        });
        fetchData();
        handleClose();
        showNotification("Đã xóa sản phẩm thành công");
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    } else {
      console.error("Không có quyền xóa sản phẩm.");
    }
  };

  const handleSelectAllCheckbox = () => {
    const updatedSanPhamData = SanPhamData.map((sanphamadmin) => ({
      ...sanphamadmin,
      selected: !selectAllChecked,
    }));
    setSanPhamData(updatedSanPhamData);
    setSelectAllChecked(!selectAllChecked);
  };

  const handleSingleCheckbox = (index) => {
    const updatedSanPhamData = [...SanPhamData];
    updatedSanPhamData[index].selected = !updatedSanPhamData[index].selected;
    setSanPhamData(updatedSanPhamData);

    const allChecked = updatedSanPhamData.every(
      (sanphamadmin) => sanphamadmin.selected
    );
    setSelectAllChecked(allChecked);
  };

  const handleDeleteAll = () => {
    if (admin) {
      const selectedIds = SanPhamData.filter(
        (sanphamadmin) => sanphamadmin.selected
      ).map((sanphamadmin) => sanphamadmin._id);
      selectedIds.forEach(async (_id) => {
        await axios.delete(`http://localhost:8000/product/${_id}`, {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        });
      });
      fetchData();
    } else {
      console.error("Không có quyền xóa sản phẩm.");
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return SanPhamData.slice(startIndex, endIndex);
  };

  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <div className="right-main">
          <div className="heading-right">
            <h1 className="danh-muc-title">Danh Sách Sản Phẩm</h1>
          </div>
          <div className="table-right">
            <table className="table-product">
              <tr className="heading-table">
                <th>
                  <input
                    className="all-check"
                    type="checkbox"
                    checked={selectAllChecked}
                    onChange={handleSelectAllCheckbox}
                  />
                </th>
                <th>STT</th>
                <th>Hình</th>
                <th>Tên</th>
                <th>Nhãn Hiệu</th>
                <th>Giá</th>
                <th>
                  <Button
                    sx={{ backgroundColor: "#edb26c", color: "white" }}
                    className="btn-deleteall"
                    disabled={!isButtonActive}
                    onClick={handleDeleteAll}
                  >
                    Xóa Tất Cả
                  </Button>
                </th>
              </tr>
              <tbody>
                {Array.isArray(SanPhamData) && SanPhamData.length > 0 ? (
                  getPaginatedData().map((sanphamadmin, index) => {
                    const absoluteIndex =
                      (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    return (
                      <tr key={sanphamadmin._id}>
                        <td className="body-table">
                          <input
                            type="checkbox"
                            checked={sanphamadmin.selected}
                            onChange={() =>
                              handleSingleCheckbox(absoluteIndex - 1)
                            }
                          />
                        </td>
                        <td className="body-table">{absoluteIndex}</td>
                        <td
                          style={{ textAlign: "center" }}
                          className="body-table"
                        >
                          <img
                            style={{ width: "50px" }}
                            src={sanphamadmin.images[0]}
                            alt="img"
                          ></img>
                        </td>
                        <td
                          style={{ textAlign: "center" }}
                          className="body-table"
                        >
                          {sanphamadmin.productName}
                        </td>
                        <td
                          style={{ textAlign: "center" }}
                          className="body-table"
                        >
                          {getBrandName(sanphamadmin.brand)}
                        </td>

                        <td
                          style={{ textAlign: "center" }}
                          className="body-table"
                        >
                          {sanphamadmin.price.toLocaleString()}
                        </td>
                        <td
                          style={{ textAlign: "center" }}
                          className="body-table"
                        >
                          {admin ? (
                            <>
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="icon"
                                onClick={() => handleClickOpen(sanphamadmin)}
                              />
                              <Link to={`/edit-product/${sanphamadmin._id}`}>
                                <FontAwesomeIcon
                                  className="icon"
                                  icon={faFilePen}
                                  style={{ color: "black" }}
                                />
                              </Link>
                            </>
                          ) : (
                            <span>Không có quyền</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">Không có dữ liệu sản phẩm.</td>
                  </tr>
                )}
              </tbody>
              {sanPhamToDelete && (
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle
                    style={{ textAlign: "center" }}
                    id="alert-dialog-title"
                  >
                    {`Xóa sản phẩm ${sanPhamToDelete.productName} ?`}
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      style={{ color: "red" }}
                      onClick={() => handleDelete(sanPhamToDelete._id)}
                    >
                      Xóa
                    </Button>
                    <Button
                      style={{ color: "green" }}
                      onClick={handleClose}
                      autoFocus
                    >
                      Hủy
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
              {notification && (
                <div className="notification">
                  <CheckCircleOutlineIcon sx={{ marginRight: "5px" }} />
                  {notification}
                </div>
              )}
            </table>
            <div className="pagination">
              <button
                className="btn-page-admin"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ArrowBackIcon />
              </button>
              <p>{currentPage}</p>
              <button
                className="btn-page-admin"
                disabled={currentPage * ITEMS_PER_PAGE >= SanPhamData.length}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ArrowForwardIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanPhamAdmin;
