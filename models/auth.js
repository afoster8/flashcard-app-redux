const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
router.post("/register", async (req, res) => {

  try {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    const { username, pin } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the pin before storing it
    const hashedPin = await bcrypt.hash(pin, 10);

    // Create a new user
    const user = new User({ username, pin: hashedPin });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
    console.log("User registered successfully");

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {

  try {
    const { username, pin } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if the PIN is correct
    const isPinValid = await bcrypt.compare(pin, user.pin);
    if (!isPinValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, "your-secret-key", { expiresIn: "500h" });

    res.status(200).json({ token });
    console.log("User login success!");

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    
  }
});

module.exports = router;
