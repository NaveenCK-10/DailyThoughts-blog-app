import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(express.json());

// --- Final CORS Configuration ---
// This is the most robust way to handle CORS for a deployed application.
const allowedOrigins = ["http://localhost:5173", "https://daily-thoughts-blog-app.vercel.app"];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); 

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// --- Schemas and Models ---
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  bio: String,
  profilePic: String,
});
const User = mongoose.model("User", userSchema);

const blogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    tags: [String],
    image: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
const Blog = mongoose.model("Blog", blogSchema);

// --- Middleware (Hardened) ---
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token provided" });
  const token = /^Bearer\s+/i.test(header) ? header.split(" ")[1] : header;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}; 

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.send("DailyThoughts Backend is running!");
});

// --- Auth Routes ---
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
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// --- Blog Routes ---
app.post("/blogs", auth, async (req, res) => {
  try {
    const blog = new Blog({ ...req.body, authorId: req.user.id });
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Create blog failed", details: err.message });
  }
});

app.get("/blogs", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(Math.min(parseInt(req.query.limit, 10) || 10, 50), 1);
    const search = req.query.search;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      };
    }

    const [blogs, totalPosts] = await Promise.all([
      Blog.find(query)
        .populate("authorId", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Blog.countDocuments(query),
    ]);

    res.json({
      blogs,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      totalPosts,
      limit,
    });
  } catch (err) {
    console.error("CRITICAL ERROR in GET /blogs:", err);
    res.status(500).json({ error: "Fetch blogs failed" });
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
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete blog failed", details: err.message });
  }
});

app.put("/blogs/:id/like", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    const userId = req.user.id;
    const idx = blog.likes.findIndex((u) => (u.equals ? u.equals(userId) : String(u) === String(userId)));
    if (idx === -1) blog.likes.push(userId);
    else blog.likes.splice(idx, 1);
    await blog.save();
    const updatedBlog = await Blog.findById(blog._id).populate("authorId", "name");
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: "Liking blog failed", details: err.message });
  }
});

app.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    const blogs = await Blog.find({ authorId: req.params.userId }).populate("authorId", "name");
    res.json({ user, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
