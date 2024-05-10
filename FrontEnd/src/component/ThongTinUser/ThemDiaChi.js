import React, { useState, useEffect } from "react";
import "../../pages/User/ThongTinNguoiDung/ControlInfor.css";
import "./ThemDiaChi.css";
import axios from "axios";

const ThemDiaChi = ({ accessToken, setIsAddAddressOpen }) => {
  const [formData, setFormData] = useState({
    thanhPho: "",
    huyen: "",
    xa: "",
    diaChiChiTiet: "",
  });

  const [thanhPhoOptions, setThanhPhoOptions] = useState([]);
  const [huyenOptions, setHuyenOptions] = useState([]);
  const [xaOptions, setXaOptions] = useState([]);
  const Swal = require("sweetalert2");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchThanhPho();
  }, []);

  const fetchThanhPho = async () => {
    try {
      const res = await axios.get("https://provinces.open-api.vn/api/p/");
      setThanhPhoOptions(res.data);
      setHuyenOptions([]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuanHuyen = async (cityCode) => {
    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/d/`);
      const quanHuyenList = res.data;
      const quanHuyenArray = [];
      quanHuyenList.forEach((quanHuyen) => {
        if (quanHuyen.province_code === cityCode) {
          quanHuyenArray.push(quanHuyen);
        }
      });
      setHuyenOptions(quanHuyenArray);
      setXaOptions([]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchXa = async (districtCode) => {
    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/w/`);
      const xaPhuongList = res.data;
      const xaPhuongArray = xaPhuongList.filter(
        (xaPhuong) => xaPhuong.district_code === districtCode
      );
      setXaOptions(xaPhuongArray);
    } catch (error) {
      console.log(error);
    }
  };

  const handleThanhPhoChange = (selectedThanhPho) => {
    const selectedCity = thanhPhoOptions.find(
      (city) => city.name === selectedThanhPho
    );
    const cityCode = selectedCity ? selectedCity.code : "";
    fetchQuanHuyen(cityCode);
    setFormData({
      ...formData,
      thanhPho: selectedThanhPho,
    });
  };

  const handleHuyenChange = (selectedHuyen) => {
    const selectedDistrict = huyenOptions.find(
      (district) => district.name === selectedHuyen
    );
    const districtCode = selectedDistrict ? selectedDistrict.code : "";
    fetchXa(districtCode);
    setFormData({
      ...formData,
      huyen: selectedHuyen,
    });
  };

  const handleXaChange = (selectedXa) => {
    setFormData({
      ...formData,
      xa: selectedXa,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const address = `${formData.diaChiChiTiet}, ${formData.xa}, ${formData.huyen}, ${formData.thanhPho}`;

    try {
      await axios.put(
        "http://localhost:8000/user/address",
        {
          address: address,
        },
        {
          headers: { token: `Bearer ${accessToken}` },
        }
      );
      setFormData({
        thanhPho: "",
        huyen: "",
        xa: "",
        diaChiChiTiet: "",
      });
      Swal.fire({
        text: "Thêm địa chỉ thành công",
        icon: "success",
      });
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    } finally {
      setIsSaving(false);
      setIsAddAddressOpen(false);
    }
  };

  const handleClose = () => {
    setIsAddAddressOpen(false);
  };

  return (
    <div className="add-addressFields">
      <h1>THÊM ĐỊA CHỈ</h1>
      <form onSubmit={handleSubmit}>
        <div className="choseSelect">
          <label>
            Thành phố:
            <select
              className="thanhPho"
              name="thanhPho"
              value={formData.thanhPho}
              onChange={(e) => handleThanhPhoChange(e.target.value)}
            >
              <option value="">Chọn Thành phố</option>
              {thanhPhoOptions.map((thanhPho) => (
                <option key={thanhPho.id} value={thanhPho.name}>
                  {thanhPho.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Huyện:
            <select
              name="huyen"
              value={formData.huyen}
              onChange={(e) => handleHuyenChange(e.target.value)}
            >
              <option value="">Chọn Huyện</option>
              {huyenOptions.map((huyen) => (
                <option key={huyen.id} value={huyen.name}>
                  {huyen.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Xã:
            <select
              name="xa"
              value={formData.xa}
              onChange={(e) => handleXaChange(e.target.value)}
            >
              <option value="">Chọn Xã</option>
              {xaOptions.map((xa) => (
                <option key={xa.id} value={xa.name}>
                  {xa.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Địa chỉ chi tiết:
            <textarea
              name="diaChiChiTiet"
              value={formData.diaChiChiTiet}
              onChange={(e) =>
                setFormData({ ...formData, diaChiChiTiet: e.target.value })
              }
            />
          </label>
        </div>
        <div className="bot-btn">
          <button className="bottomBTN" type="submit">
            {isSaving ? "Đang Lưu....." : "Lưu"}
          </button>
          <button className="bottomBTN" type="button" onClick={handleClose}>
            Đóng
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThemDiaChi;
