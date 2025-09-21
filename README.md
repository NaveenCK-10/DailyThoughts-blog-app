# DailyThoughts – Full-Stack Blogging Platform

**Live Demo:** [https://daily-thoughts-blog-app.vercel.app/](https://daily-thoughts-blog-app.vercel.app/)  

![DailyThoughts Homepage](https://github.com/NaveenCK-10/DailyThoughts-blog-app/blob/main/Screenshot%202025-09-21%20214221.png)  

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

## API Endpoints

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
## How It’s Built

### Backend
- **Mongoose Models:** `User` and `Blog`, with `Blog.authorId` referencing `User`. Author names are populated on list/detail routes to avoid extra frontend queries.  
- **JWT Middleware:** Reads the `Authorization` header, trims the `"Bearer "` prefix if present, and verifies tokens with a shared secret.  
- **CORS:** Explicit origin allowlist plus `Authorization` header to handle browser preflights.  

**Strengthening the Backend (`server.js`)**  
While the backend structure, routes, and logic were implemented manually, I used AI assistance to **strengthen `server.js`**. AI helped with:  
- Optimizing route structure and error handling  
- Handling edge cases in authentication and token verification  
- Debugging middleware and CORS issues  
- Ensuring consistency between backend payloads and frontend expectations  

This made the backend **robust and reliable**, while all core design and implementation decisions were made by me.

### Frontend
- **Redux Toolkit:** Manages blog list and details with async thunks.  
- **Axios:** Adds `Authorization: Bearer <token>` for protected routes.  
- **Home Page Search:** Simple form reloads `/blogs` with query parameters for filtering.  

---

## AI Assistance & Prompting Techniques
AI tools (ChatGPT, GitHub Copilot) were used **alongside manual coding** to:  

- Debug errors and resolve **conflict issues**  
- Suggest improvements in backend middleware and server structure  
- Provide code snippets for specific problems, like JWT verification or CORS configuration  
- Ensure backend and frontend state align correctly  

**Prompting techniques that worked well:**  
- `"Here’s the exact error text. Suggest a minimal fix that keeps items an array."`  
- `"CORS preflight with Authorization failing from this origin. Provide a working server.js snippet."`  
- `"Optimize backend server.js for authentication and error handling."`  

Even with AI suggestions, **all logic, models, and architecture were designed and implemented by me**.

---

## Challenges and Solutions
- **CORS Preflight Failures:** Fixed by explicit origin allowlist and allowed `Authorization` header.  
- **Malformed Tokens:** Extracted safely by checking for `"Bearer "` prefix on the server.  
- **Payload Shape Drift:** Normalized payloads in reducers and kept server response consistent.  

---


