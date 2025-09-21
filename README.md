# DailyThoughts - A Full-Stack Blog Platform

**Live Demo:** [Link to be added after you deploy]

![Screenshot of the DailyThoughts homepage](https://github.com/NaveenCK-10/DailyThoughts-blog-app/blob/main/Screenshot%202025-09-21%20214221.png)
*(You can replace this with a real screenshot of your app after deploying)*

---
## Project Overview

This project is a full-stack blogging platform I built called "DailyThoughts". The goal was to create a complete web application from scratch where users can sign up, create and manage their own blog posts, and view profiles of other users. I built it using the MERN stack (MongoDB, Express, React, Node.js) and implemented all the essential features like user authentication and full CRUD functionality for posts. I also implemented a bonus search feature to make the app more dynamic.

---
## ✅ Features

### Core Features Implemented
- **User Authentication:** Secure user signup and login with JWT-based session handling.
- **Blog Post CRUD:** Users can create, read, update, and delete their own blog posts.
- **Author Profiles:** Public profile pages for each author, displaying their bio and a list of their posts.

### Bonus Features Implemented
- **Search:** A search bar on the homepage to find blogs by title or tag.

---
## 🛠️ Tech Stack

- **Frontend:** React, Redux Toolkit, React Router, Axios, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcrypt for password hashing

---
## 🚀 Setup Instructions

If you'd like to run this project on your own machine, here’s how to do it.

**1. Get the Code**
First, clone the repository to your computer:
```bash
git clone [https://github.com/NaveenCK-10/DailyThoughts-blog-app.git](https://github.com/NaveenCK-10/DailyThoughts-blog-app.git)
cd DailyThoughts-blog-app

# Go into the backend folder
cd backend

# Install the necessary packages
npm install

You'll also need to create a .env file in the /backend folder. It just needs two things:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_tokens

Once that's done, you can start the server:
node server.js

3. Set Up the Frontend
# In a new terminal, go into the frontend folder
cd frontend

# Install the necessary packages
npm install

# Start the development server
npm run dev

The app should now be running in your browser!



🔌 API Endpoints
The backend provides the following REST API endpoints:

Auth
Method	Endpoint	Description	Requires Auth
POST	/auth/signup	Register a new user.	No
POST	/auth/login	Log in a user and get a token.	No

Export to Sheets
Blogs
Method	Endpoint	Description	Requires Auth
GET	/blogs	Get all blogs (supports search & pagination).	No
POST	/blogs	Create a new blog post.	Yes
GET	/blogs/:id	Get a single blog post by its ID.	No
PUT	/blogs/:id	Update a blog post.	Yes (Author)
DELETE	/blogs/:id	Delete a blog post.	Yes (Author)

Export to Sheets
Profiles
Method	Endpoint	Description	Requires Auth
GET	/profile/:userId	Get a user's profile and all their posts.	No

Export to Sheets
