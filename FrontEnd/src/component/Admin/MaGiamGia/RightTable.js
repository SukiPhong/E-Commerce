import React from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen, faTrash } from "@fortawesome/free-solid-svg-icons";

const RightMain = ({
  selectAllChecked,
  handleSelectAllCheckbox,
  handlePageChange,
  handleCheckboxChange,
  handleDeleteAll,
  currentVouchers,
  totalPages,
  onDeleteVoucher,
  currentPage,
}) => {
  return (
    <div className="right-main">
      <div className="heading-right">
        <h1 className="danh-muc-title">Danh Sách Mã Giảm Giá</h1>
      </div>
      <div className="table-right">
        <table className="table-product">
          <thead>
            <tr className="heading-table">
              <th>
                <input
                  className="all-check"
                  type="checkbox"
                  onChange={handleSelectAllCheckbox}
                  checked={selectAllChecked}
                />
              </th>
              <th>Tên Mã</th>
              <th>Giá Trị</th>
              <th>Thời Gian Sử Dụng</th>
              <th>Giá Trị Đơn Hàng</th>
              <th>
                <div className="delete-all-container">
                  <Button
                    sx={{ backgroundColor: "#edb26c", color: "white" }}
                    className="btn-deleteall"
                    onClick={handleDeleteAll}
                  >
                    Xóa Tất Cả
                  </Button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentVouchers.map((voucher, index) => (
              <tr key={voucher._id}>
                <td className="body-table">
                  <input
                    type="checkbox"
                    checked={voucher.selected}
                    onChange={() => handleCheckboxChange(voucher._id)}
                  />
                </td>

                <td style={{ textAlign: "center" }} className="body-table">
                  {voucher.name}
                </td>
                <td style={{ textAlign: "center" }} className="body-table">
                  {voucher.discount}%
                </td>
                <td style={{ textAlign: "center" }} className="body-table">
                  {new Date(voucher.expiry).toLocaleDateString()}
                </td>
                <td style={{ textAlign: "center" }} className="body-table">
                  {voucher.exclusive.toLocaleString()}
                </td>
                <td style={{ textAlign: "center" }} className="body-table">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon"
                    onClick={() => onDeleteVoucher(voucher._id)}
                  />
                  <FontAwesomeIcon
                    className="icon"
                    icon={faFilePen}
                    style={{ color: "black" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                className={`btnpagevoucher ${
                  page === currentPage ? "current-page" : ""
                }`}
                key={page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RightMain;
