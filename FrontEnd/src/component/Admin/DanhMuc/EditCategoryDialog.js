import React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const EditCategoryDialog = ({
  open,
  handleClose,
  danhMucToEdit,
  handleEditSubmit,
  newCategoryName,
  setNewCategoryName,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "2.4rem" }}>
        ĐỔI TÊN DANH MỤC
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: "1.5rem" }}>
          Tên hiện tại: {danhMucToEdit.categoryName}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Tên danh mục mới"
          type="text"
          fullWidth
          variant="standard"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={handleEditSubmit}>Xác Nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoryDialog;
