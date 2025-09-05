const express = require("express");
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
