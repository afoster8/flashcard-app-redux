require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 3001;

const corsOptions = {
  origin: "https://intense-atoll-92670.herokuapp.com",
  credentials: true,
  optionSuccessStatus: 200,
  exposedHeaders: ["Authorization"],
}

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.use("/auth", authRoutes);

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