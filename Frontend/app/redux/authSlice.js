import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase";

const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  user: null,
  isAuthenticated: false,
  supabaseUser: null,
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
      state.supabaseUser = null;

      localStorage.removeItem("access_token");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setSupabaseUser: (state, action) => {
      state.supabaseUser = action.payload;
      state.isAuthenticated = true;
    },
    initializeSupabaseAuth: (state) => {
      // Initialize Supabase auth listener
      supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          state.supabaseUser = session.user;
          state.isAuthenticated = true;
        } else {
          state.supabaseUser = null;
          state.isAuthenticated = false;
        }
      });
    },
  },
});

export const { setCredentials, logout, setUser, setSupabaseUser, initializeSupabaseAuth } = authSlice.actions;
export default authSlice.reducer;
