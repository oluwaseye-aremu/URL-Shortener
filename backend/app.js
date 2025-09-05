/*const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// ✅ Define mongoURI before using it
const mongoURI = process.env.MONGO_URI || "mongodb://mongo:27017/urlshortener";

// ✅ Connection with retry logic
const connectWithRetry = () => {
  console.log("⏳ Trying MongoDB connection...");
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      setTimeout(connectWithRetry, 5000); // retry after 5 seconds
    });
};

connectWithRetry();

// ✅ Simple route
app.get("/", (req, res) => {
  res.send("🚀 URL Shortener Backend is running with MongoDB!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
**/
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public")); // ✅ Serve static files (HTML/JS)

// ✅ Define mongoURI before using it
const mongoURI = process.env.MONGO_URI || "mongodb://mongo:27017/urlshortener";

// ✅ Connection with retry logic
const connectWithRetry = () => {
  console.log("⏳ Trying MongoDB connection...");
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// ✅ Simple route
app.get("/api", (req, res) => {
  res.json({ message: "🚀 URL Shortener Backend is running with MongoDB!" });
});

// ✅ Dummy shorten endpoint (for testing frontend)
app.post("/shorten", (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required" });
  }
  // Normally you’d save to DB and generate a short code
  const shortUrl = `http://localhost:5000/u/abc123`;
  res.json({ longUrl, shortUrl });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
