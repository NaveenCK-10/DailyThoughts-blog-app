import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchBlogById, deleteBlog } from "../features/blogSlice.js";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBlog: blog } = useSelector((state) => state.blogs);
  const { token } = useSelector((state) => state.auth);

  const user = token ? parseJwt(token) : null;


  console.log("--- DEBUGGING INFO ---");
  console.log("Logged-in User ID:", user?.id);
  console.log("Blog Author ID:", blog?.authorId?._id);
  console.log("----------------------");
 

  const isAuthor = user && blog && user.id === blog.authorId?._id;

  useEffect(() => {
    dispatch(fetchBlogById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deleteBlog(id)).then(() => {
        navigate("/");
      });
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="blog-full">
      <h1>{blog.title}</h1>
      <p>by <Link to={`/profile/${blog.authorId?._id}`}>{blog.authorId?.name}</Link></p>
      
      {isAuthor && (
        <div style={{ marginBottom: '1rem' }}>
          <Link to={`/blogs/edit/${blog._id}`} style={{ marginRight: '1rem' }}>
            <button>Edit Post</button>
          </Link>
          <button onClick={handleDelete} style={{ backgroundColor: '#dc3545' }}>
            Delete Post
          </button>
        </div>
      )}

      {blog.image && <img src={blog.image} alt={blog.title} className="blog-image" />}
      <div className="blog-content">{blog.content}</div>
      <div className="blog-tags">Tags: {blog.tags?.join(", ")}</div>
    </div>
  );
}