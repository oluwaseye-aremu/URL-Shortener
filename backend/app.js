const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
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

// ✅ Schema + Model
const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
});
const Url = mongoose.model("Url", urlSchema);

// ✅ Home route
app.get("/", (req, res) => {
  res.send("🚀 URL Shortener Backend is running with MongoDB!");
});

// ✅ POST /shorten → create short URL
app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required" });
  }

  // Generate short code
  const shortCode = shortid.generate();

  // Save mapping to MongoDB
  await Url.create({ longUrl, shortCode });

  // Return short URL
  const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
  res.json({ shortUrl });
});

// ✅ GET /:code → redirect
app.get("/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
