import React, { useEffect, useState } from "react";
import LeftMenu from "../LeftMenu";
import "../Styles/MaGiamGia.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../service/userSlice";
import RightMain from "./RightTable";

const MaGiamGiaAdmin = () => {
  const Swal = require("sweetalert2");
  const accessToken = useSelector(selectAccessToken);
  const [voucherData, setVoucherData] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVouchers = voucherData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(voucherData.length / itemsPerPage);

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/coupon");
      setVoucherData(res.data.data);
    } catch (error) {
      console.error("Error fetching voucher data:", error);
    }
  };

  const onDeleteVoucher = async (voucherId) => {
    try {
      const result = await Swal.fire({
        title: "Bạn chắc chắn muốn xóa voucher này?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8000/coupon/${voucherId}`, {
          headers: { token: `Bearer ${accessToken}` },
        });
        fetchData();
        Swal.fire("Đã xóa!", "Voucher đã được xóa thành công.", "success");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      Swal.fire("Lỗi!", "Đã có lỗi xảy ra khi xóa voucher.", "error");
    }
  };

  const handleCheckboxChange = (voucherId) => {
    const updatedVoucherData = voucherData.map((voucher) => {
      if (voucher._id === voucherId) {
        return {
          ...voucher,
          selected: !voucher.selected,
        };
      }
      return voucher;
    });
    setVoucherData(updatedVoucherData);
  };

  const handleSelectAllCheckbox = () => {
    const updatedVoucherData = voucherData.map((voucher) => ({
      ...voucher,
      selected: !selectAllChecked,
    }));
    setVoucherData(updatedVoucherData);
    setSelectAllChecked(!selectAllChecked);
  };

  const handleDeleteAll = async () => {
    try {
      const selectedVoucherIds = voucherData
        .filter((voucher) => voucher.selected)
        .map((voucher) => voucher._id);
      if (selectedVoucherIds.length === 0) {
        Swal.fire("Chưa chọn voucher nào để xóa!", "", "warning");
        return;
      }
      const result = await Swal.fire({
        title: "Bạn chắc chắn muốn xóa những voucher đã chọn?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        await Promise.all(
          selectedVoucherIds.map(async (voucherId) => {
            await axios.delete(`http://localhost:8000/coupon/${voucherId}`, {
              headers: { token: `Bearer ${accessToken}` },
            });
          })
        );
        fetchData();
        Swal.fire("Đã xóa!", "Các voucher đã được xóa thành công.", "success");
      }
    } catch (error) {
      console.error("Error deleting vouchers:", error);
      Swal.fire("Lỗi!", "Đã có lỗi xảy ra khi xóa voucher.", "error");
    }
  };

  return (
    <div className="main">
      <div className="container">
        <LeftMenu />
        <RightMain
          selectAllChecked={selectAllChecked}
          handleSelectAllCheckbox={handleSelectAllCheckbox}
          handlePageChange={handlePageChange}
          handleCheckboxChange={handleCheckboxChange}
          handleDeleteAll={handleDeleteAll}
          currentVouchers={currentVouchers}
          totalPages={totalPages}
          onDeleteVoucher={onDeleteVoucher}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default MaGiamGiaAdmin;
