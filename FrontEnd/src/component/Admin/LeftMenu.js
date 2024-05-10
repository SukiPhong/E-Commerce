import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookTanakh,
  faSquarePollHorizontal,
  faReceipt,
  faSquarePollVertical,
  faBagShopping,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

const LeftMenu = () => {
  const location = useLocation();
  const isDanhMucPage = location.pathname === "/danhmuc";
  const isNhanHieuPage = location.pathname === "/nhanhieu";
  const isSanPhamPage = location.pathname === "/sanphamadmin";
  const isMaGiamGiaPage = location.pathname === "/magiamgiaadmin";

  return (
    <div className="left-menu">
      <div className="group-control">
        <Link
          to="/danhsachdanhmuc"
          className={`btn-main ${
            isDanhMucPage ||
            location.pathname === "/danhsachdanhmuc" ||
            location.pathname === "/themdanhmuc"
              ? "active-link"
              : ""
          }`}
        >
          {" "}
          <FontAwesomeIcon className="icon-main" icon={faBookTanakh} />
          <span>Danh Mục</span>
        </Link>
        {(isDanhMucPage ||
          location.pathname === "/danhsachdanhmuc" ||
          location.pathname === "/themdanhmuc") && (
          <>
            <Link
              to="/danhsachdanhmuc"
              className={
                location.pathname === "/danhsachdanhmuc"
                  ? "btn-extra active"
                  : "btn-extra"
              }
            >
              Danh sách danh mục
            </Link>
            <Link
              to="/themdanhmuc"
              className={
                location.pathname === "/themdanhmuc"
                  ? "btn-extra active"
                  : "btn-extra"
              }
            >
              Thêm danh mục
            </Link>
          </>
        )}
        <Link
          to="/danhsachnhanhieu"
          className={`btn-main ${
            isNhanHieuPage ||
            location.pathname === "/danhsachnhanhieu" ||
            location.pathname === "/themnhanhieu"
              ? "active-link"
              : ""
          }`}
        >
          {" "}
          <FontAwesomeIcon
            className="icon-main"
            icon={faSquarePollHorizontal}
          />
          <span>Nhãn Hiệu</span>
        </Link>
        {(isNhanHieuPage ||
          location.pathname === "/danhsachnhanhieu" ||
          location.pathname === "/themnhanhieu") && (
          <>
            <Link
              to="/danhsachnhanhieu"
              className={
                location.pathname === "/danhsachnhanhieu"
                  ? "btn-extra active"
                  : "btn-extra"
              }
            >
              Danh sách nhãn hiệu
            </Link>
            <Link
              to="/themnhanhieu"
              className={
                location.pathname === "/themnhanhieu"
                  ? "btn-extra active"
                  : "btn-extra"
              }
            >
              Thêm nhãn hiệu
            </Link>
          </>
        )}

        {/* ------------------------------- */}
        <Link
          to="/danhsachsanphamadmin"
          className={`btn-main ${
            isSanPhamPage ||
            location.pathname === "/danhsachsanphamadmin" ||
            location.pathname === "/themsanpham"
              ? "active-link"
              : ""
          }`}
        >
          {" "}
          <FontAwesomeIcon className="icon-main" icon={faBagShopping} />
          <span>Sản Phẩm</span>
        </Link>
        {(isSanPhamPage ||
          location.pathname === "/danhsachsanphamadmin" ||
          location.pathname === "/themsanpham") && (
          <>
            <Link
              to="/danhsachsanphamadmin"
              className={
                location.pathname === "/danhsachsanphamadmin"
                  ? "btn-extra active"
                  : "btn-extra"
              }
            >
              Danh sách Sản Phẩm
            </Link>
            <Link
              to="/themsanpham"
              className={
                location.pathname === "/themsanpham"
                  ? "btn-extra active"
                  : "btn-extra"
              }
            >
              Thêm Sản Phẩm
            </Link>
          </>
        )}
        {/* ------------------------------------- */}
        <Link
          to="/taikhoanadmin"
          className={`btn-main ${
            location.pathname === "/taikhoanadmin" ? "active-link" : ""
          }`}
        >
          <FontAwesomeIcon className="icon-main" icon={faCircleUser} />
          <span>Tài Khoản</span>
        </Link>
        {/* ------------------------------------------ */}
        <Link
          to="/danhsachvoucher"
          className={`btn-main ${
            isMaGiamGiaPage ||
            location.pathname === "/danhsachvoucher" ||
            location.pathname === "/themmagiamgia"
              ? "active-link"
              : ""
          }`}
        >
          <FontAwesomeIcon className="icon-main" icon={faReceipt} />
          <span>Mã Giảm Giá</span>
        </Link>
        {(isMaGiamGiaPage ||
          location.pathname === "/danhsachvoucher" ||
          location.pathname === "/themmagiamgia") && (
          <>
            <Link
              to="/danhsachvoucher"
              className={
                location.pathname === "/danhsachvoucher"
                  ? "btn-extra active"
                  : "btn-extra"
              }
            >
              Danh sách mã giảm giá
            </Link>
            <Link
              to="/themmagiamgia"
              className={
                location.pathname === "/themmagiamgia"
                  ? "btn-extra active"
                  : "btn-extra"
              }
            >
              Thêm mã giảm giá
            </Link>
          </>
        )}

        {/* -------------------------------------------- */}

        <Link
          to="/hoadon"
          className={`btn-main ${
            location.pathname === "/hoadon" ? "active-link" : ""
          }`}
        >
          <FontAwesomeIcon className="icon-main" icon={faBookTanakh} />
          <span>Hóa Đơn</span>
        </Link>
        {/* -------------------------------------------------- */}
        <Link
          to="/thongke"
          className={`btn-main ${
            location.pathname === "/thongke" ? "active-link" : ""
          }`}
        >
          <FontAwesomeIcon className="icon-main" icon={faSquarePollVertical} />
          <span>Thống Kê</span>
        </Link>
      </div>
    </div>
  );
};

export default LeftMenu;
