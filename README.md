# DailyThoughts - A Full-Stack Blog Platform

**Live Demo:** [Link to be added after you deploy]  
![Screenshot of the DailyThoughts homepage](https://github.com/NaveenCK-10/DailyThoughts-blog-app/blob/main/Screenshot%202025-09-21%20214221.png)  


---

## Project Overview
This project is a full-stack blogging platform called **DailyThoughts**. The goal was to create a complete web application from scratch where users can sign up, create and manage their own blog posts, and view profiles of other users.  

It was built using the **MERN stack (MongoDB, Express, React, Node.js)** and includes essential features like **user authentication** and **full CRUD functionality for posts**, along with bonus search functionality.

---

## Features

### Core Features Implemented
- **User Authentication:** Secure user signup and login with JWT-based session handling.
- **Blog Post CRUD:** Users can create, read, update, and delete their own blog posts.
- **Author Profiles:** Public profile pages for each author, displaying their bio and a list of their posts.

### Bonus Features Implemented
- **Search:** A dynamic search bar on the homepage to find blogs by title or tag.

---

##  Tech Stack
- **Frontend:** React, Redux Toolkit, React Router, Axios, Vite  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JSON Web Tokens (JWT), bcrypt for password hashing  

---

## Setup Instructions

### 1. Get the Code
**Clone the repository to your computer:**
**git clone https://github.com/NaveenCK-10/DailyThoughts-blog-app.git**
cd DailyThoughts-blog-app

### 2. Set Up the Backend
cd backend
npm install

**Create a `.env` file inside the **/backend** folder with the following:**
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_tokens

**Start the backend server:**
node server.js

### 3. Set Up the Frontend
**In a new terminal:**
**cd frontend
npm install
npm run dev**

**The app should now be running in your browser !!**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint      | Description                | Requires Auth |
|--------|--------------|----------------------------|---------------|
| POST   | /auth/signup | Register a new user        | No            |
| POST   | /auth/login  | Log in a user & get token  | No            |

### Blogs
| Method | Endpoint      | Description                        | Requires Auth |
|--------|--------------|------------------------------------|---------------|
| GET    | /blogs       | Get all blogs (with search & pagination) | No       |
| POST   | /blogs       | Create a new blog post             | Yes          |
| GET    | /blogs/:id   | Get a single blog post by ID       | No           |
| PUT    | /blogs/:id   | Update a blog post (author only)   | Yes          |
| DELETE | /blogs/:id   | Delete a blog post (author only)   | Yes          |

### Profiles
| Method | Endpoint         | Description                         | Requires Auth |
|--------|-----------------|-------------------------------------|---------------|
| GET    | /profile/:userId | Get a user's profile and their posts | No           |

---
