import React, { useState, useEffect } from "react";
import LeftMenu from "../LeftMenu";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../service/userSlice";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Swal from "sweetalert2";
import "../Styles/TaiKhoan.css";

const ITEMS_PER_PAGE = 5;

const TaiKhoan = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const accessToken = useSelector(selectAccessToken);
  const [taiKhoanData, setTaiKhoanData] = useState([]);
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [taiKhoanToDelete, setTaiKhoanToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleClickOpen = (user) => {
    setOpen(true);
    setTaiKhoanToDelete(user);
  };

  const handleClose = () => {
    setOpen(false);
    setTaiKhoanToDelete(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      });

      const formattedTaiKhoanData = response.data.user.map((user) => ({
        ...user,
        selected: false,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "",
      }));

      setTaiKhoanData(formattedTaiKhoanData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu từ API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  });

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`http://localhost:8000/user/${_id}`, {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      });
      handleClose();
      showNotification("Đã xóa thành công");
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      showNotification("Lỗi khi xóa sản phẩm");
    }
  };

  const handleUpdateAdmin = async (user) => {
    let title = user.admin ? "Hủy Quyền Admin" : "Cập nhật quyền admin";
    let text = user.admin
      ? `Hủy quyền admin cho tài khoản ${user.username}?`
      : `Cập nhật quyền admin cho tài khoản ${user.username}?`;

    const result = await Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      showLoaderOnConfirm: true,
    });

    if (result.isConfirmed) {
      try {
        Swal.showLoading();
        const response = await axios.put(
          `http://localhost:8000/user/update/${user._id}`,
          { admin: !user.admin },
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          }
        );
        Swal.close();
        if (response.data.success) {
          showNotification(
            `Đã ${
              user.admin ? "hủy quyền admin" : "cập nhật quyền admin"
            } thành công`
          );
          fetchData();
        } else {
          showNotification("Có lỗi xảy ra khi cập nhật quyền admin");
        }
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu cập nhật quyền admin:", error);
        showNotification("Lỗi khi gửi yêu cầu cập nhật quyền admin");
      }
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return taiKhoanData.slice(startIndex, endIndex);
  };

  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <div className="right-main">
          <div className="heading-right">
            <h1 className="right-title">Danh Sách Tài Khoản</h1>
          </div>
          <div className="table-right">
            <table style={{ width: "80%" }}>
              <tr className="heading-table">
                <th>
                  <input className="checkbox-main" type="checkbox" />
                </th>
                <th style={{ width: "100px" }}>Họ và Tên</th>
                <th>Email</th>
                <th>SDT</th>
                <th>Ngày tạo</th>
                <th>Quyền Admin</th>
                <th className="empty-cell">
                  <Button sx={{ backgroundColor: "#edb26c", color: "white" }}>
                    Xóa
                  </Button>
                </th>
              </tr>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="body-table" colSpan="6">
                      Loading...
                    </td>
                  </tr>
                ) : Array.isArray(taiKhoanData) && taiKhoanData.length > 0 ? (
                  getPaginatedData().map((user) => (
                    <tr key={user._id}>
                      <td className="body-table">
                        <input type="checkbox" className="checkbox-main" />
                      </td>
                      <td className="body-table" style={{ width: "200px" }}>
                        {user.username}
                      </td>
                      <td className="body-table" style={{ width: "200px" }}>
                        {user.email}
                      </td>
                      <td className="body-table" style={{ width: "200px" }}>
                        {user.phoneNumber}
                      </td>
                      <td className="body-table" style={{ width: "200px" }}>
                        {user.createdAt}
                      </td>
                      <td className="body-table" style={{ width: "100px" }}>
                        <input
                          className="round-checkbox"
                          type="checkbox"
                          checked={user.admin}
                          onChange={() => handleUpdateAdmin(user)}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center" }}
                        className="body-table"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="icon"
                          onClick={() => handleClickOpen(user)}
                        />
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
              {taiKhoanToDelete && (
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
                    {`Xóa người dùng ${taiKhoanToDelete.username} ?`}
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      style={{ color: "red" }}
                      onClick={() => handleDelete(taiKhoanToDelete._id)}
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
                disabled={currentPage * ITEMS_PER_PAGE >= taiKhoanData.length}
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

export default TaiKhoan;
