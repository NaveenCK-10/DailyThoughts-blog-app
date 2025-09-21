import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx"; // Corrected casing
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import Profile from "./pages/Profile.jsx"; // 1. ADD THIS IMPORT
import EditBlog from "./pages/EditBlog.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/profile/:userId" element={<Profile />} /> {/* 2. ADD THIS ROUTE */}
          <Route path="/blogs/edit/:id" element={<EditBlog />} /> 
        </Routes>
      </main>
    </BrowserRouter>
  );
}