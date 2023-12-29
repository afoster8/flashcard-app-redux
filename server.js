require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); 

const app = express();
const port = process.env.PORT || 3001;
const authRoutes = require("./models/auth");

const cors = require("cors");
app.options("/auth/register", cors());

const corsOptions ={
    origin:"http://localhost:3000", 
    credentials:true,            
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {

    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.userId; 
    next();

  });
};

app.get("/user-data", verifyToken, async (req, res) => {
  try {

    const userData = await User.findOne({ _id: req.userId });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: userData.username,
      data: userData.data, 
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });

  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});