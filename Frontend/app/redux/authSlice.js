import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // Save token in browser storage
      localStorage.setItem("access_token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("access_token");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { setCredentials, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
