// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    admin: false,
    accessToken: null,
    login: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setLogin: (state, action) => {
      state.user = action.payload;
      state.login = true;
    },
    setLogout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.login = false;
    },
  },
});

export const { setUser, setAdmin, setAccessToken, setLogin, setLogout } =
  userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectAdmin = (state) => state.user.admin;
export const selectAccessToken = (state) => state.user.accessToken;
export const selectIsLoggedIn = (state) => state.user.login;

export default userSlice.reducer;
