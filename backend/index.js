import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS
const FRONTEND_URL = "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB connection
const mongoURI =
  "mongodb+srv://shreyandeyrudra:8mcFnc7gpZGaHWEi@cluster0.ggeww.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  lastClickTime: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);

const JWT_SECRET = process.env.JWT_SECRET || "12345";

// ✅ Middleware for authentication
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ SIGNUP ROUTE
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

// ✅ LOGIN ROUTE
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        lastClickTime: user.lastClickTime,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// ✅ CLAIM REWARD ROUTE (Auto Resets at Midnight)
app.post("/click-button", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const lastClickTime = user.lastClickTime || new Date(0);

    // Reset at midnight
    const lastClickDay = lastClickTime.toISOString().split("T")[0];
    const today = now.toISOString().split("T")[0];

    if (lastClickDay === today) {
      return res.status(400).json({
        message:
          "You have already claimed your reward today! Come back at midnight.",
      });
    }

    // Update points
    user.points += 10;
    user.lastClickTime = now;
    await user.save();

    res.json({ message: "✅ Reward claimed!", points: user.points });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error claiming reward", error: err.message });
  }
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET USER DATA ROUTE
app.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user data", error: err.message });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
