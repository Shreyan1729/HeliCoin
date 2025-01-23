// Import dependencies
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

// Initialize app and configure middleware
const app = express();
app.use(express.json());

const FRONTEND_URL = "http://localhost:5173"; // Replace this with your frontend URL
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow cookies if needed
  })
);

// MongoDB connection URI
const mongoURI =
  "mongodb+srv://shreyandeyrudra:8mcFnc7gpZGaHWEi@cluster0.ggeww.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  points: { type: Number, default: 0 },
  lastClickTime: Date,
});

const User = mongoose.model("User", userSchema);

const JWT_SECRET = "12345"; // Change this to a secure secret in production

// SIGNUP ROUTE
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, user });
});

// MIDDLEWARE
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// ADD POINTS
app.post("/click-button", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);

  const now = new Date();
  const lastClickTime = user.lastClickTime || new Date(0);
  const timeDifference = now - lastClickTime;

  if (timeDifference < 24 * 60 * 60 * 1000) {
    return res
      .status(400)
      .json({ message: "You can only click the button once in 24 hours" });
  }

  user.points += 10;
  user.lastClickTime = now;
  await user.save();

  res.json({ message: "Button clicked", points: user.points });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
