import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../features/blogSlice.js";

export default function CreateBlog() {
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogData = {
      ...form,
      tags: form.tags.split(",").map(tag => tag.trim()),
    };
    dispatch(createBlog(blogData)).then(() => navigate("/"));
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Create New Blog</h2>
        <input name="title" placeholder="Title" required onChange={handleChange} />
        <textarea name="content" placeholder="Content..." required onChange={handleChange}></textarea>
        <input name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}