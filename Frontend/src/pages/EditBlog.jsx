import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateBlog } from "../features/blogSlice.js";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const blogToEdit = useSelector((state) => 
    state.blogs.items.find((blog) => blog._id === id)
  );

  const [form, setForm] = useState({ title: "", content: "", tags: "", image: "" });

  useEffect(() => {
    if (blogToEdit) {
      setForm({
        title: blogToEdit.title,
        content: blogToEdit.content,
        image: blogToEdit.image || "",
        tags: blogToEdit.tags.join(", "),
      });
    }
  }, [blogToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...form,
      tags: form.tags.split(",").map(tag => tag.trim()),
    };
    dispatch(updateBlog({ id, updatedData })).then(() => {
      navigate(`/blogs/${id}`);
    });
  };

  if (!blogToEdit) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit Blog Post</h2>
        <input name="title" placeholder="Title" value={form.title} required onChange={handleChange} />
        <input name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} />
        <textarea name="content" placeholder="Content..." value={form.content} required onChange={handleChange}></textarea>
        <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}