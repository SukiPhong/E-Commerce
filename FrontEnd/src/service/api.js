import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const getUserFavorites = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/current`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });

    return response.data.user.Favorites;
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy danh sách yêu thích:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product`);
    return response.data.productDatas;
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy danh sách sản phẩm:", error);
    throw error;
  }
};

export const getAvatar = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/current`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response.data.user.Avatar;
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};
export const getCart = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/current`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response.data.user.Cart;
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};
export const getUserCurrent = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/current`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response.data.user;
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};
export const getVoucher = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coupon`);
    return response.data.data;
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};
export const getOneProduct = async (productId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/product?_id=${productId}`
    );
    return response.data.productDatas;
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};
export const getDeleteAllCartUser = async (accessToken) => {
  try {
    await axios.patch(`${API_BASE_URL}/user/Cart`, null, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};

export const getAllOrder = async (accessToken) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/order/admin`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return res.data.response;
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};

export const getAllUser = async (accessToken) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return res.data.user;
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};