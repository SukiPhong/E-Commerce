import React, { useState, useEffect } from "react";
import LeftMenu from "../LeftMenu";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../Styles/DanhMuc.css";
import { useSelector } from "react-redux";
import { selectAdmin, selectAccessToken } from "../../../service/userSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditCategoryDialog from "./EditCategoryDialog";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ITEMS_PER_PAGE = 5;

const DanhMuc = () => {
  const [danhMucData, setDanhMucData] = useState([]);
  const admin = useSelector(selectAdmin);
  const accessToken = useSelector(selectAccessToken);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const checkedCount = danhMucData.filter((danhMuc) => danhMuc.selected).length;
  const isButtonActive = checkedCount >= 2 && admin;
  const [notification, setNotification] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [danhMucToEdit, setdanhMucToEdit] = useState(null);
  const [danhMucToDelete, setDanhMucToDelete] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const Swal = require("sweetalert2");
  const [editListBrand, setEditListBrand] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  const handleClickOpen = (danhMuc) => {
    setOpen(true);
    setDanhMucToDelete(danhMuc);
  };
  const handleClose = () => {
    setOpen(false);
    setDanhMucToDelete(null);
  };
  const handleOpenEdit = async (danhMuc) => {
    setOpenEdit(true);
    setdanhMucToEdit(danhMuc);
    setNewCategoryName(danhMuc.categoryName);
    setEditListBrand(danhMuc.brand);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleEditSubmit = async () => {
    if (admin) {
      try {
        await axios.put(
          `http://localhost:8000/Category/${danhMucToEdit._id}`,
          {
            categoryName: newCategoryName,
          },
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          }
        );
        fetchData();
        showNotification("Thay đổi danh mục thành công");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Trùng tên danh mục",
        });
      }
    } else {
      console.error("Không có quyền sửa danh mục.");
    }

    handleCloseEdit();
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Category");
      setDanhMucData(
        response.data.prodCategory.map((danhMuc) => ({
          ...danhMuc,
          selected: false,
        }))
      );
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu từ API:", error);
    }
  };
  const handleDelete = async (_id) => {
    if (admin) {
      try {
        await axios.delete(`http://localhost:8000/Category/${_id}`, {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        });
        fetchData();
        showNotification("Đã xóa danh mục thành công");
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
      }
    } else {
      console.error("Không có quyền xóa danh mục.");
    }
    handleClose();
  };
  const handleSelectAllCheckbox = () => {
    const updatedDanhMucData = danhMucData.map((danhMuc) => ({
      ...danhMuc,
      selected: !selectAllChecked,
    }));
    setDanhMucData(updatedDanhMucData);
    setSelectAllChecked(!selectAllChecked);
  };
  const handleSingleCheckbox = (index) => {
    const updatedDanhMucData = [...danhMucData];
    updatedDanhMucData[index].selected = !updatedDanhMucData[index].selected;
    setDanhMucData(updatedDanhMucData);

    const allChecked = updatedDanhMucData.every((danhMuc) => danhMuc.selected);
    setSelectAllChecked(allChecked);
  };
  const handleDeleteAll = async () => {
    const confirmResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa hết danh mục?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    if (admin && checkedCount >= 2) {
      const selectedDanhMucs = danhMucData.filter(
        (danhMuc) => danhMuc.selected
      );

      try {
        await Promise.all(
          selectedDanhMucs.map((danhMuc) => handleDelete(danhMuc._id))
        );

        fetchData();
        setSelectAllChecked(false);
      } catch (error) {
        console.error("Lỗi khi xóa các danh mục:", error);
      }
    } else {
      console.error(
        "Không có quyền xóa hoặc phải chọn ít nhất 2 danh mục để xóa."
      );
    }
  };

  const totalItems = danhMucData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const visibleDanhMucData = danhMucData.slice(startIndex, endIndex);

  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <div className="right-main">
          <div className="heading-right">
            <h1 className="right-title">Danh Sách danh mục</h1>
          </div>
          <div className="table-right">
            <table style={{ width: "80%" }}>
              <thead>
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
                  <th>ID</th>
                  <th>Danh Mục</th>
                  <th className="empty-cell">
                    <Button
                      sx={{ backgroundColor: "#edb26c", color: "white" }}
                      disabled={!isButtonActive}
                      onClick={handleDeleteAll}
                    >
                      Xóa
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(visibleDanhMucData) &&
                visibleDanhMucData.length > 0 ? (
                  visibleDanhMucData.map((danhMuc, index) => (
                    <tr key={danhMuc._id}>
                      <td className="body-table">
                        <input
                          type="checkbox"
                          checked={danhMuc.selected}
                          onChange={() => handleSingleCheckbox(index)}
                        />
                      </td>
                      <td className="body-table">{startIndex + index + 1}</td>
                      <td className="body-table">{danhMuc._id}</td>
                      <td
                        style={{ textAlign: "center" }}
                        className="body-table"
                      >
                        {danhMuc.categoryName}
                      </td>

                      <td
                        style={{ textAlign: "center" }}
                        className="body-table"
                      >
                        <>
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="icon"
                            onClick={() => handleClickOpen(danhMuc)}
                          />
                          <FontAwesomeIcon
                            className="icon"
                            icon={faFilePen}
                            onClick={() => handleOpenEdit(danhMuc)}
                          />
                          {openEdit && (
                            <EditCategoryDialog
                              open={openEdit}
                              handleClose={handleCloseEdit}
                              danhMucToEdit={danhMucToEdit}
                              handleEditSubmit={handleEditSubmit}
                              newCategoryName={newCategoryName}
                              setNewCategoryName={setNewCategoryName}
                              setEditListBrand={setEditListBrand}
                              editListBrand={editListBrand}
                            />
                          )}
                          <div className="delete-or-not">
                            {danhMucToDelete && (
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
                                  {`Xóa danh mục ${danhMucToDelete.categoryName} ?`}
                                </DialogTitle>
                                <DialogActions>
                                  <Button
                                    style={{ color: "red" }}
                                    onClick={() => handleDelete(danhMuc._id)}
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
                          </div>
                          {notification && (
                            <div className="notification">
                              <CheckCircleOutlineIcon
                                sx={{ marginRight: "5px" }}
                              />
                              {notification}
                            </div>
                          )}
                        </>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="body-table" colSpan="6">
                      Không có dữ liệu danh mục.
                    </td>
                  </tr>
                )}
              </tbody>
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
                disabled={currentPage === totalPages}
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

export default DanhMuc;
