import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice.js';

export default function Navbar() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  return (
    <nav className="navbar">
      <Link to="/">
        <img 
          src="/vite.svg" 
          alt="DailyThoughts Logo" 
          style={{ height: "36px" }} 
        />
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/create-blog">Create Post</Link>
            <button onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
