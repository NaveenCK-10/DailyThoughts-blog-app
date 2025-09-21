import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API || "https://dailythoughts-backend-mfkx.onrender.com";

const q = (params = {}) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

export const fetchBlogs = createAsyncThunk(
  "blogs/fetch",
  async ({ search = "" } = {}, { rejectWithValue }) => {
    try {
      const qs = q({ search });
      const res = await axios.get(`${API}/blogs${qs ? `?${qs}` : ""}`);
      return res.data; // array of blogs
    } catch (err) {
      return rejectWithValue(err?.response?.data || { error: "Fetch blogs failed" });
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/blogs/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { error: "Fetch blog failed" });
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/create",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(`${API}/blogs`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { error: "Create blog failed" });
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/update",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(`${API}/blogs/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { error: "Update blog failed" });
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${API}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { error: "Delete blog failed" });
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    items: [],
    currentBlog: null,
    status: "idle",
    error: null,
    search: "",
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload ?? "";
    },
    resetBlogs(state) {
      state.items = [];
      state.currentBlog = null;
      state.status = "idle";
      state.error = null;
      state.search = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        const list = Array.isArray(action.payload)
          ? action.payload
          : Array.isArray(action.payload?.blogs)
          ? action.payload.blogs
          : [];
        state.items = list;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error;
        if (!Array.isArray(state.items)) state.items = [];
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.error = action.payload || action.error;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        if (Array.isArray(state.items)) state.items.unshift(action.payload);
        else state.items = [action.payload];
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.error = action.payload || action.error;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentBlog?._id === action.payload._id) state.currentBlog = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.error = action.payload || action.error;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.payload || action.error;
      });
  },
});

export const { setSearch, resetBlogs } = blogSlice.actions;
export default blogSlice.reducer;
