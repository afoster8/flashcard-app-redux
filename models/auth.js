const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./User");
const Deck = require("./Deck");

/* in this file, you find magic */
/* what does it do... */
/* One day i'll be smart enough to understand what it does. */

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

// Register a new user
router.post("/register", async (req, res, next) => {
  try {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    const { username, pin } = req.body;

    // Validate request data
    if (!username || !pin) {
      return res.status(400).json({ error: "Username and pin are required" });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the pin before storing it
    const hashedPin = await bcrypt.hash(pin, 10);

    // Get the next userID
    const highestUser = await User.findOne({}, {}, { sort: { 'userID': -1 } });
    const nextUserID = highestUser ? highestUser.userID + 1 : 0;

    // Create a new user with an empty array for decks
    const user = new User({ username, pin: hashedPin, userID: nextUserID, decks: [] });
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

// Define a route to create a new deck
router.post("/create-deck", verifyToken, async (req, res) => {

  try {
    const { deckName, cards } = req.body;

    const newDeck = new Deck({
      name: deckName,
      cards: cards || [], 
    });

    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.decks.push(newDeck);
    await user.save();

    res.status(201).json({ message: "Deck created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route to get all decks for a user
router.get("/get-decks", verifyToken, async (req, res) => {

  try {
    const user = await User.findOne({ _id: req.userId }).populate("decks");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const decks = user.decks.map((deck) => ({
      id: deck._id,
      name: deck.name,
      cards: deck.cards,
    }));

    res.status(200).json({ decks });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route to get a specific deck for a user
router.get("/get-deck/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deck = user.decks.find((deck) => deck._id == req.params.id);

    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    res.status(200).json({
      id: deck._id,
      name: deck.name,
      cards: deck.cards,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update a specific deck for a user
router.put("/update-deck/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cards } = req.body;

    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deckIndex = user.decks.findIndex((deck) => deck._id == id);
    if (deckIndex === -1) {
      return res.status(404).json({ error: "Deck not found" });
    }

    // Update the deck in the user's decks array
    user.decks[deckIndex].name = name;
    user.decks[deckIndex].cards = cards;

    await user.save();

    res.status(200).json({ message: "Deck updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update a specific card within a deck for a user
router.patch("/update-card/:deckId/:cardId", verifyToken, async (req, res) => {

  try {

    const { deckId, cardId } = req.params;
    const { front, back, starred } = req.body;

    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(req.params);
    console.log("user", user);
    console.log("deckId", deckId);
    console.log("cardId", cardId);

    const deck = user.decks.find((deck) => deck._id == deckId);
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    const cardIndex = deck.cards.findIndex((card) => card._id == cardId);
    if (cardIndex === -1) {
      return res.status(404).json({ error: "Card not found" });
    }

    deck.cards[cardIndex].front = front;
    deck.cards[cardIndex].back = back;
    deck.cards[cardIndex].starred = starred;
    console.log(deck.cards[cardIndex].starred);

    console.log(front);
    console.log(back);

    try {
      await user.save();
  } catch (error) {
      console.error("Error saving user:", error);
  }  

    res.status(200).json({ message: "Card updated successfully" });
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;