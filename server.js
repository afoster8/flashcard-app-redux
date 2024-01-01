const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const authRoutes = require("./routes/auth");
const port = process.env.PORT || 3001;
const path = require("path");
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'frontend/dist' directory
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// Routes
app.use("/auth", authRoutes);

// Handle all other routes by serving the main HTML file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});