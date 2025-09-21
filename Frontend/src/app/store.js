// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import blogReducer from "../features/blogSlice.js";
import profileReducer from "../features/profileSlice.js"; // 1. Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    profile: profileReducer, // 2. Add reducer
  },
});