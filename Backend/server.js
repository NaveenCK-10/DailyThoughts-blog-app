// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error(" MongoDB Connection Failed:", err.message);
    process.exit(1);
  });


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  bio: String,
  profilePic: String,
});
const User = mongoose.model("User", userSchema);

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  image: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // <-- ADD THIS LINE
}, { timestamps: true });

const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};


app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash: hash });
    await user.save();

    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});


app.post("/blogs", auth, async (req, res) => {
  try {
    const blog = new Blog({ ...req.body, authorId: req.user.id });
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Create blog failed", details: err.message });
  }
});

// The updated code (with search)
app.get("/blogs", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } }, // Case-insensitive search on title
          { tags: { $regex: search, $options: "i" } },  // Case-insensitive search on tags
        ],
      };
    }

    const blogs = await Blog.find(query).populate("authorId", "name");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Fetch blogs failed", details: err.message });
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("authorId", "name");
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Fetch blog failed", details: err.message });
  }
});

app.put("/blogs/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.authorId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    Object.assign(blog, req.body);
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Update blog failed", details: err.message });
  }
});

app.delete("/blogs/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.authorId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await blog.deleteOne();
    res.json({ message: " Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete blog failed", details: err.message });
  }
});

// ADD THIS ENTIRE NEW ROUTE
app.put("/blogs/:id/like", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const userId = req.user.id;
    const userIndex = blog.likes.indexOf(userId);

    if (userIndex === -1) {
      // If user has not liked, add their ID to the likes array
      blog.likes.push(userId);
    } else {
      // If user has already liked, remove their ID (toggle)
      blog.likes.splice(userIndex, 1);
    }

    await blog.save();
    // Repopulate author info before sending back
    const updatedBlog = await Blog.findById(blog._id).populate("authorId", "name");
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: "Liking blog failed", details: err.message });
  }
});

app.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const blogs = await Blog.find({ authorId: req.params.userId }).populate("authorId", "name");

    res.json({ user, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
