// src/pages/Profile.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchProfile } from '../features/profileSlice.js';

export default function Profile() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { data: profile, status } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile(userId));
  }, [dispatch, userId]);

  if (status === 'loading' || !profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      {}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <img 
         src={profile.user.profilePic || '/blog write.png'}
          alt={profile.user.name} 
          style={{ width: '150px', height: '150px', borderRadius: '50%' }}
        />
        <h1>{profile.user.name}</h1>
        <p>{profile.user.bio || 'This author has not written a bio yet.'}</p>
      </div>

      {}
      <h2>Posts by {profile.user.name}</h2>
      <div className="blog-list">
        {profile.blogs.map((blog) => (
          <div key={blog._id} className="blog-preview">
            <h3><Link to={`/blogs/${blog._id}`}>{blog.title}</Link></h3>
          </div>
        ))}
      </div>
    </div>
  );
}