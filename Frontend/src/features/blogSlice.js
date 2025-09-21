import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://dailythoughts-backend-mfkx.onrender.com";

// 1. THIS ACTION IS NOW UPDATED FOR SEARCH
export const fetchBlogs = createAsyncThunk(
  "blogs/fetch",
  async (searchTerm = "") => {
    let url = `${API}/blogs`;
    if (searchTerm) {
      url += `?search=${searchTerm}`;
    }
    const res = await axios.get(url);
    return res.data;
  }
);

// 2. Fetch a single blog by its ID
export const fetchBlogById = createAsyncThunk("blogs/fetchById", async (id) => {
  const res = await axios.get(`${API}/blogs/${id}`);
  return res.data;
});

// 3. Create a new blog
export const createBlog = createAsyncThunk("blogs/create", async (data, { getState }) => {
  const token = getState().auth.token;
  const res = await axios.post(`${API}/blogs`, data, {
    headers: { Authorization: token },
  });
  return res.data;
});

// 4. Update an existing blog
export const updateBlog = createAsyncThunk("blogs/update", async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(`${API}/blogs/${id}`, updatedData, {
        headers: { Authorization: token },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 5. Delete a blog
export const deleteBlog = createAsyncThunk("blogs/delete", async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${API}/blogs/${id}`, {
        headers: { Authorization: token },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    items: [],
    currentBlog: null,
    status: 'idle'
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.currentBlog = action.payload;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.items.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.currentBlog = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.items = state.items.filter(blog => blog._id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
