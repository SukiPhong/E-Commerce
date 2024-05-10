import React from "react";
import { Route, Routes } from "react-router-dom";
import TrangChu from "./pages/TrangChu";
import SanPham from "./pages/SanPham";
import { ThongTin } from "./pages/User/ThongTinNguoiDung/ThongTin";
import { LoginSignupPage } from "./pages/User/Login-Signup/index";
import DiaChi from "./pages/User/ThongTinNguoiDung/DiaChi";
import LichSuMuaHang from "./pages/User/ThongTinNguoiDung/LichSuMuaHang";
import Voucher from "./pages/User/ThongTinNguoiDung/Voucher";
import ThongBao from "./pages/User/ThongTinNguoiDung/ThongBao";
import YeuThich from "./pages/User/ThongTinNguoiDung/YeuThich";
import { AvatarProvider } from "./component/Avatar/AvatarContext";
import GioHang from "./pages/GioHang";
import ThanhToan from "./pages/ThanhToan";
import ChiTietSanPham from "./pages/chitietsanpham";
import MaGiamGiaShop from "./pages/MaGiamGiaShop";
import Admin from "./pages/admin";
import DanhMuc from "./component/Admin/DanhMuc/DanhMuc";
import ThemDanhMuc from "./component/Admin/DanhMuc/ThemDanhMuc";
import NhanHieu from "./component/Admin/NhanHieu/NhanHieu";
import ThemNhanHieu from "./component/Admin/NhanHieu/ThemNhanHieu";
import SanPhamAdmin from "./component/Admin/SanPhamAdmin/SanPhamAdmin";
import ThemSanPhamAdmin from "./component/Admin/SanPhamAdmin/ThemSanPhamAdmin";
import TaiKhoan from "./component/Admin/DanhSachTaiKhoan/TaiKhoan";
import HoaDon from "./component/Admin/HoaDon";
import MaGiamGiaAdmin from "./component/Admin/MaGiamGia/MaGiamGiaAdmin";
import ThongKe from "./component/Admin/ThongKe";
import ResetPass from "./pages/User/Login-Signup/ResetPass";
import SanPhamDanhMuc from "./pages/SanPhamDanhMuc";
import EditSanPham from "./component/Admin/SanPhamAdmin/EditSanPham";
import ThemMaGiamGia from "./component/Admin/MaGiamGia/ThemMaGiamGia";
import ThanhToan1SP from "./pages/ThanhToan1SP";
import DoiMatKhau from "./pages/User/ThongTinNguoiDung/DoiMatKhau";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<TrangChu />} />
        <Route path="/sanpham" element={<SanPham />} />
        <Route
          path="/sanpham/danhmucsanpham/:categoryId"
          element={<SanPhamDanhMuc />}
        />
        <Route path="/chitietsanpham/:productId" element={<ChiTietSanPham />} />
        <Route path="/edit-product/:productId" element={<EditSanPham />} />
        <Route path="/giohang" element={<GioHang />} />

        <Route path="/thanhtoan" element={<ThanhToan />} />

        <Route path="/magiamgiashop" element={<MaGiamGiaShop />} />
        <Route path="/admin-dashbar" element={<Admin />} />
        <Route path="/danhsachdanhmuc" element={<DanhMuc />} />
        <Route path="/themdanhmuc" element={<ThemDanhMuc />} />
        <Route path="/danhsachnhanhieu" element={<NhanHieu />} />
        <Route path="/themnhanhieu" element={<ThemNhanHieu />} />
        <Route path="/danhsachsanphamadmin" element={<SanPhamAdmin />} />
        <Route path="/themsanpham" element={<ThemSanPhamAdmin />} />
        <Route path="/taikhoanadmin" element={<TaiKhoan />} />
        <Route path="/hoadon" element={<HoaDon />} />
        <Route path="/danhsachvoucher" element={<MaGiamGiaAdmin />} />
        <Route path="/themmagiamgia" element={<ThemMaGiamGia />} />
        <Route path="/thongke" element={<ThongKe />} />

        <Route
          path="/thongtin"
          element={
            <AvatarProvider>
              <ThongTin />
            </AvatarProvider>
          }
        />

        <Route
          path="/thongtin/diachi"
          element={
            <AvatarProvider>
              <DiaChi />
            </AvatarProvider>
          }
        />
        <Route
          path="/thongtin/lichsumuahang"
          element={
            <AvatarProvider>
              <LichSuMuaHang />
            </AvatarProvider>
          }
        />
        <Route
          path="/thongtin/voucher"
          element={
            <AvatarProvider>
              <Voucher />
            </AvatarProvider>
          }
        />

        <Route
          path="/thongtin/thongbao"
          element={
            <AvatarProvider>
              <ThongBao />
            </AvatarProvider>
          }
        />
        <Route
          path="/thongtin/yeuthich"
          element={
            <AvatarProvider>
              <YeuThich />
            </AvatarProvider>
          }
        />
        <Route
          path="/thongtin/doimatkhau"
          element={
            <AvatarProvider>
              <DoiMatKhau />
            </AvatarProvider>
          }
        />

        <Route path="/login-register" element={<LoginSignupPage />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/thanhtoan/:productName" element={<ThanhToan1SP />} />
      </Routes>
    </>
  );
};

export default App;
