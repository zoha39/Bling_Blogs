const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const errorMiddleware = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const unsplashRoutes = require("./routes/unsplashRoutes");

const commentRoutes = require("./routes/commentRoutes");

const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

// ---------- Global Middleware ----------

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/unsplash", unsplashRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/users", userRoutes);

// ---------- Health Check ----------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bling Blogs API is running",
  });
});

// ---------- Routes ----------

app.use("/api/auth", authRoutes);

app.use("/api/blogs", blogRoutes);

// ---------- 404 Handler ----------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ---------- Error Handler ----------

app.use(errorMiddleware);

// ---------- Start Server ----------

app.listen(PORT, () => {
  console.log(`Bling Blogs backend running on port ${PORT}`);
});
