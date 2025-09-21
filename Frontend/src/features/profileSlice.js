// src/features/profileSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://dailythoughts-backend-mfkx.onrender.com";

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (userId) => {
    const res = await axios.get(`${API}/profile/${userId}`);
    return res.data;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null, // will be { user: {...}, blogs: [...] }
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      });
  },
});

export default profileSlice.reducer;
