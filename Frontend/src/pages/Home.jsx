import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../features/blogSlice.js";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.items);
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Initial fetch of all blogs when the component loads
    dispatch(fetchBlogs());
  }, [dispatch]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchBlogs(searchTerm));
  };

  const clearSearch = () => {
    setSearchTerm("");
    dispatch(fetchBlogs()); // Fetch all blogs again
  };

  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search by title or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <button type="submit">Search</button>
        {searchTerm && <button type="button" onClick={clearSearch} style={{backgroundColor: '#6c757d'}}>Clear</button>}
      </form>

      <h2>All Blogs</h2>
      <div className="blog-list">
        {blogs && blogs.length > 0 ? (
          blogs.map((b) => (
            <div key={b._id} className="blog-preview">
              <h3><Link to={`/blogs/${b._id}`}>{b.title}</Link></h3>
              <p>By <Link to={`/profile/${b.authorId?._id}`}>{b.authorId?.name}</Link></p>
            </div>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
}