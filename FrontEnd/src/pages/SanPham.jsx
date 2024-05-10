import React, { useState, useEffect } from "react";
import Loading from "../component/Loading/Loading";
import ProductList from "../component/SanPham/ProductList";
import PageController from "../component/SanPham/PageController";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../service/userSlice";
import "../component/SanPham/SanPham.css";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const BRANDS_API_URL = "http://localhost:8000/brand";
const PRODUCTS_API_URL = "http://localhost:8000/product";

const fetchBrands = () => axios.get(BRANDS_API_URL);
const fetchProducts = () => axios.get(PRODUCTS_API_URL);

const SanPham = () => {
  const [initialProducts, setInitialProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [brands, setBrands] = useState([]);
  const sanPhamTrenMotTrang = 12;
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState("");
  const [checkBrand, setCheckBrand] = useState([]);
  const accessToken = useSelector(selectAccessToken);
  const [open, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [messageServerity, setMessageServerity] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [productCountsByBrand, setProductCountsByBrand] = useState({});

  const handleClick = () => {
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const FilterPrice = (priceRange) => {
    const filteredProducts = initialProducts.filter((product) => {
      const price = product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    setFilteredProducts(filteredProducts);
    setTrangHienTai(1);
  };
  const FilterBrand = (brandId) => {
    const updatedCheckBrand = [...checkBrand];

    if (updatedCheckBrand.includes(brandId)) {
      const index = updatedCheckBrand.indexOf(brandId);
      updatedCheckBrand.splice(index, 1);
    } else {
      updatedCheckBrand.push(brandId);
    }

    setCheckBrand(updatedCheckBrand);
    const filteredProducts = filterProductsByBrand(
      initialProducts,
      updatedCheckBrand
    );
    setFilteredProducts(filteredProducts);
    setCurrentSort("");
    setShowFilterOptions(showFilterOptions);
    setTrangHienTai(1);
  };
  const filterProductsByBrand = (products, selectedBrands) => {
    if (!selectedBrands || selectedBrands.length === 0) {
      return products;
    }
    const filteredProducts = products.filter((product) =>
      selectedBrands.includes(product.brand)
    );

    return filteredProducts;
  };
  const addFavorite = async (productId) => {
    if (!accessToken) {
      setMessage("BẠN CHƯA ĐĂNG NHẬP TÀI KHOẢN!");
      setMessageServerity("warning");
      handleClick();
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/user/favorites/${productId}`,
        null,
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.success === true) {
        setMessage("ĐÃ THÊM VÀO YÊU THÍCH!");
        setMessageServerity("success");
      } else if (response.data.success === false) {
        setMessage("ĐÃ BỎ YÊU THÍCH SẢN PHẨM!");
        setMessageServerity("info");
      }
      handleClick();
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBrands();
        setBrands(response.data.Brands);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thương hiệu:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const response = await fetchProducts();
        if (
          response.data.success &&
          Array.isArray(response.data.productDatas)
        ) {
          const uniqueProducts = response.data.productDatas
            .reverse()
            .filter(
              (product, index, self) =>
                index === self.findIndex((p) => p._id === product._id)
            );
          setInitialProducts(uniqueProducts);
          setFilteredProducts(uniqueProducts);
          const productCounts = {};
          uniqueProducts.forEach((product) => {
            const brandId = product.brand;
            productCounts[brandId] = (productCounts[brandId] || 0) + 1;
          });
          setProductCountsByBrand(productCounts);
        } else {
          console.error(
            "Dữ liệu từ API không phải là mảng hoặc không thành công."
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, []);

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("cart");
      localStorage.removeItem("cartList");
      setLoading(false);
    }, 1200);
  }, []);
  const sortFunctions = {
    AZ: (a, b) => a.productName.localeCompare(b.productName),
    ZA: (a, b) => b.productName.localeCompare(a.productName),
    PriceAsc: (a, b) => a.price - b.price,
    PriceDesc: (a, b) => b.price - a.price,
  };
  const handleSort = (type) => {
    const sortFunction = sortFunctions[type] || ((a, b) => a - b);
    const sorted = [...filteredProducts].sort(sortFunction);
    setFilteredProducts(sorted);
    setCurrentSort(type);
    setTrangHienTai(1);

    setShowFilterOptions(false);
  };
  if (loading) {
    return <Loading />;
  }
  const viTriSanPhamCuoiCung = trangHienTai * sanPhamTrenMotTrang;
  const viTriSanPhamDauTien = viTriSanPhamCuoiCung - sanPhamTrenMotTrang;
  const sanPhamTrenTrangHienTai = filteredProducts.slice(
    viTriSanPhamDauTien,
    viTriSanPhamCuoiCung
  );

  return (
    <div style={{ backgroundColor: "#f0f0f0", padding: "5px" }}>
      <div className="content">
        <ProductList
          currentSort={currentSort}
          showFilterOptions={showFilterOptions}
          toggleFilterOptions={toggleFilterOptions}
          handleSort={handleSort}
          brands={brands}
          sanPhamTrenTrangHienTai={sanPhamTrenTrangHienTai}
          checkBrand={checkBrand}
          FilterBrand={FilterBrand}
          FilterPrice={FilterPrice}
          addFavorite={addFavorite}
          loadingPage={loadingPage}
          productCountsByBrand={productCountsByBrand}
        />

        <PageController
          trangHienTai={trangHienTai}
          paginate={setTrangHienTai}
          products={filteredProducts}
          sanPhamTrenMotTrang={sanPhamTrenMotTrang}
        />
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={messageServerity}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.4rem",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SanPham;
