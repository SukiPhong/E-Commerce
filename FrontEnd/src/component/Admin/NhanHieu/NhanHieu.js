import React, { useState, useEffect } from "react";
import LeftMenu from "../LeftMenu";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../Styles/NhanHieu.css";
import { useSelector } from "react-redux";
import { selectAdmin, selectAccessToken } from "../../../service/userSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";

const NhanHieu = () => {
  const [nhanhieuData, setNhanhieuData] = useState([]);
  const admin = useSelector(selectAdmin);
  const accessToken = useSelector(selectAccessToken);
  const checkedCount = nhanhieuData.filter(
    (nhanhieu) => nhanhieu.selected
  ).length;
  const isButtonActive = checkedCount >= 2 && admin;
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [notification, setNotification] = useState(null);
  const [nhanHieuToDelete, setNhanHieuToDelete] = useState(null);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [nhanHieuToEdit, setNhanHieuToEdit] = useState(null);
  const [newBrandName, setNewBrandName] = useState("");
  const Swal = require("sweetalert2");

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  const handleClickOpen = (nhanhieu) => {
    setOpen(true);
    setNhanHieuToDelete(nhanhieu);
  };
  const handleClose = () => {
    setOpen(false);
    setNhanHieuToDelete(null);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const responseBrand = await axios.get("http://localhost:8000/Brand");
      setNhanhieuData(responseBrand.data.Brands);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu từ API:", error);
    }
  };

  const handleDelete = async (_id) => {
    if (admin) {
      try {
        await axios.delete(`http://localhost:8000/Brand/${_id}`, {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        });
        fetchData();
        showNotification("Đã xóa nhãn hiệu thành công");
        handleClose();
      } catch (error) {
        console.error("Lỗi khi xóa nhãn hiệu:", error);
      }
    } else {
      console.error("Không có quyền xóa.");
    }
  };

  const handleSelectAllCheckbox = () => {
    const updatedNhanHieuData = nhanhieuData.map((nhanhieu) => ({
      ...nhanhieu,
      selected: !selectAllChecked,
    }));
    setNhanhieuData(updatedNhanHieuData);
    setSelectAllChecked(!selectAllChecked);
  };
  
  const handleSingleCheckbox = (index) => {
    const updatedNhanHieuData = [...nhanhieuData];
    updatedNhanHieuData[index].selected = !updatedNhanHieuData[index].selected;
    setNhanhieuData(updatedNhanHieuData);

    const allChecked = updatedNhanHieuData.every(
      (nhanhieu) => nhanhieu.selected
    );
    setSelectAllChecked(allChecked);
  };
  const handleDeleteAll = async () => {
    if (admin && checkedCount >= 2) {
      const selectedNhanHieu = nhanhieuData.filter(
        (nhanhieu) => nhanhieu.selected
      );

      try {
        await Promise.all(
          selectedNhanHieu.map((nhanhieu) => handleDelete(nhanhieu._id))
        );

        fetchData();
        setSelectAllChecked(false);
      } catch (error) {
        console.error("Lỗi khi xóa các nhãn hiệu:", error);
      }
    } else {
      console.error(
        "Không có quyền xóa hoặc phải chọn ít nhất 2 nhãn hiệu để xóa."
      );
    }
  };
  const handleOpenEdit = async (nhanhieu) => {
    setOpenEdit(true);
    setNhanHieuToEdit(nhanhieu);
    setNewBrandName(nhanhieu.brandName);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleEditSubmit = async () => {
    if (admin) {
      try {
        await axios.put(
          `http://localhost:8000/brand/${nhanHieuToEdit._id}`,
          {
            brandName: newBrandName,
          },
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          }
        );
        fetchData();
        showNotification("Đã sửa tên nhãn hiệu thành công");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Trùng tên nhãn hiệu",
        });
      }
    } else {
      console.error("lỗi.");
    }
    handleCloseEdit();
  };

  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <div className="right-main">
          <div className="heading-right">
            <h1 className="danh-muc-title">Danh Sách nhãn hiệu</h1>
          </div>
          <div className="table-right">
            <table style={{ width: "80%" }}>
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
                <th>Nhãn Hiệu</th>
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
              <tbody>
                {Array.isArray(nhanhieuData) && nhanhieuData.length > 0 ? (
                  nhanhieuData.map((nhanhieu, index) => (
                    <tr key={nhanhieu._id}>
                      <td className="body-table">
                        <input
                          type="checkbox"
                          checked={nhanhieu.selected}
                          onChange={() => handleSingleCheckbox(index)}
                        />
                      </td>
                      <td className="body-table">{index + 1}</td>
                      <td className="body-table">{nhanhieu._id}</td>
                      <td
                        style={{ textAlign: "center" }}
                        className="body-table"
                      >
                        {nhanhieu.brandName}
                      </td>
                      <td
                        style={{ textAlign: "center" }}
                        className="body-table"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="icon"
                          onClick={() => handleClickOpen(nhanhieu)}
                        />
                        <FontAwesomeIcon
                          className="icon"
                          icon={faFilePen}
                          onClick={() => handleOpenEdit(nhanhieu)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Không có dữ liệu nhãn hiệu.</td>
                  </tr>
                )}
                {openEdit && (
                  <Dialog open={openEdit} onClose={handleCloseEdit}>
                    <DialogTitle
                      sx={{ fontWeight: "bold", fontSize: "2.4rem" }}
                    >
                      ĐỔI TÊN NHÃN HIỆU
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText sx={{ fontSize: "1.5rem" }}>
                        Tên hiện tại: {nhanHieuToEdit.brandName}
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tên danh mục mới"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newBrandName}
                        onChange={(e) => setNewBrandName(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseEdit}>Cancel</Button>
                      <Button onClick={handleEditSubmit}>Subscribe</Button>
                    </DialogActions>
                  </Dialog>
                )}
                {nhanHieuToDelete && (
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
                      {`Xóa nhãn hiệu ${nhanHieuToDelete.brandName} ?`}
                    </DialogTitle>
                    <DialogActions>
                      <Button
                        style={{ color: "red" }}
                        onClick={() => handleDelete(nhanHieuToDelete._id)}
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
                  <div className="notification">{notification}</div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NhanHieu;
