import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, setSearch } from "../features/blogSlice.js";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, search } = useSelector((s) => s.blogs);
  const [searchTerm, setSearchTerm] = useState(search || "");

  useEffect(() => {
    dispatch(fetchBlogs({ search: search || "" }));
  }, [dispatch]); // initial load

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchTerm));
    dispatch(fetchBlogs({ search: searchTerm }));
  };

  const clearSearch = () => {
    setSearchTerm("");
    dispatch(setSearch(""));
    dispatch(fetchBlogs({ search: "" }));
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Search by title or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <button type="submit">Search</button>
        {searchTerm && (
          <button type="button" onClick={clearSearch} style={{ backgroundColor: "#6c757d" }}>
            Clear
          </button>
        )}
      </form>

      <h2>All Blogs</h2>
      {status === "loading" && <p>Loading...</p>}
      <div className="blog-list">
        {items && items.length > 0 ? (
          items.map((b) => (
            <div key={b._id} className="blog-preview">
              <h3><Link to={`/blogs/${b._id}`}>{b.title}</Link></h3>
              <p>By <Link to={`/profile/${b.authorId?._id}`}>{b.authorId?.name}</Link></p>
              {b.image && <img src={b.image} alt={b.title} className="blog-image" />}
              <div className="blog-content">{b.content}</div>
              <div className="blog-tags">Tags: {b.tags?.join(", ")}</div>
            </div>
          ))
        ) : (
          status !== "loading" && <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
}
