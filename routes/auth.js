const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Deck = require("../models/Deck");

/* verify that the token sent with the request is valid */
const verifyToken = (req, res, next) => {
  /* check authorization header for token (will be sent in request) */
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  /* jwt magic */
  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
};



/* ROUTES */


/* Register */
router.post("/register", async (req, res) => {
  try {
    const { username, pin } = req.body;

    /* ensure we have a valid input (i.e. it exists) */
    if (!username || !pin) {
      return res.status(400).json({ error: "Username and pin are required" });
    }

    /* check if username already exists */
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    /* Hash PIN before storing */
    const hashedPin = await bcrypt.hash(pin, 10);

    /* get next user ID by looking at the last user ID and incrementing */
    const highestUser = await User.findOne({}, {}, { sort: { 'userID': -1 } });
    const nextUserID = highestUser ? highestUser.userID + 1 : 0;

    /* create a new user with given parameters, with an empty array for decks */
    const user = new User({
      username,
      pin: hashedPin,
      userID: nextUserID,
      decks: [],
      folders: []
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/* Login */
router.post("/login", async (req, res) => {
  try {
    const { username, pin } = req.body;

    /* check that user exists */
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    /* check if the PIN is correct */
    const isPinValid = await bcrypt.compare(pin, user.pin);
    if (!isPinValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    /* generate a JWT token for authentication */
    const token = jwt.sign({ userId: user._id }, "your-secret-key", { expiresIn: "500h" });

    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/* Update a user's username */
router.put("/update-username", verifyToken, async (req, res) => {
  try {
    const { newUsername } = req.body;

    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }

    /* update user's username field */
    user.username = newUsername;
    await user.save();

    res.status(200).json({ message: "Username updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/* Update a user's PIN */
router.put("/update-pin", verifyToken, async (req, res) => {
  try {
    const { newPin } = req.body;

    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(401).json({ error: "Invalid PIN" });
    }

    /* hash pin, replace old pin, and save user */
    const hashedPin = await bcrypt.hash(newPin, 10);
    user.pin = hashedPin;
    await user.save();

    res.status(200).json({ message: "PIN updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/* Delete a user account */
router.delete("/delete-account", verifyToken, async (req, res) => {
  try {
    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(401).json({ error: "Invalid PIN" });
    }

    /* delete user from db */
    await user.deleteOne();

    res.status(200).json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/* GET all of the folders in the a user's folders field */
router.get("/get-folders", verifyToken, async (req, res) => {
  try {
    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const folders = user.folders;
    res.status(200).json(folders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* GET all of the decks in a user's deck field */
router.get("/get-decks", verifyToken, async (req, res) => {
  try {
    /* check that user exists */
    const user = await User.findOne({ _id: req.userId }).populate("decks");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* send information for all the decks */
    const decks = user.decks.map((deck) => ({
      id: deck._id,
      name: deck.name,
      cards: deck.cards,
      folder: deck.folder
    }));

    res.status(200).json({ decks });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* GET a specific deck (identified by id) from a user's deck field */
router.get("/get-deck/:id", verifyToken, async (req, res) => {
  try {
    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* check that deck exists */
    const deck = user.decks.find((deck) => deck._id == req.params.id);
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    /* send deck information */
    res.status(200).json({
      id: deck._id,
      name: deck.name,
      cards: deck.cards,
      folder: deck.folder
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* Update the folders field of a user */
router.put("/update-folders", verifyToken, async (req, res) => {
  try {
    const { folders } = req.body;

    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* Update folders field */
    user.folders = folders;
    await user.save();

    res.status(201).json({ message: "Folder updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* Add a deck to the user's deck field */
router.post("/create-deck", verifyToken, async (req, res) => {
  try {
    const { deckName, cards, folderArray } = req.body;

    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* add new deck to user's deck field */
    const newDeck = new Deck({
      name: deckName,
      folder: folderArray,
      cards: cards || [],
    });

    user.decks.push(newDeck);
    await user.save();

    res.status(201).json({ message: "Deck created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* Update a specific deck in a user's deck field */
router.put("/update-deck/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cards, folder } = req.body;

    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* check that deck exists */
    const deckIndex = user.decks.findIndex((deck) => deck._id == id);
    if (deckIndex === -1) {
      return res.status(404).json({ error: "Deck not found" });
    }

    /* Update the deck in the user's decks array */
    user.decks[deckIndex].name = name;
    user.decks[deckIndex].cards = cards;
    user.decks[deckIndex].folder = folder;

    await user.save();
    res.status(200).json({ message: "Deck updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* Update a specific card in a specific deck in the user's deck field 
  Used for updating the starring status of a card, mostly */
router.patch("/update-card/:deckId/:cardId", verifyToken, async (req, res) => {
  try {

    /* deckID and cardID come from parameters when request is made 
    and starring status comes from request body */
    const { deckId, cardId } = req.params;
    const { starred } = req.body;

    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* check that deck exists */
    const deck = user.decks.find((deck) => deck._id == deckId);
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    /* check that card exists */
    const cardIndex = deck.cards.findIndex((card) => card._id == cardId);
    if (cardIndex === -1) {
      return res.status(404).json({ error: "Card not found" });
    }

    /* save starring status in user */
    deck.cards[cardIndex].starred = starred;
    await user.save();
    res.status(200).json({ message: "Card updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* DELETE a specific deck from a user's deck field */
router.delete("/delete-deck/:id", verifyToken, async (req, res) => {
  try {
    /* check that user exists */
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* Find the index of the deck to be deleted */
    const deckIndex = user.decks.findIndex((deck) => deck._id == req.params.id);
    if (deckIndex === -1) {
      return res.status(404).json({ error: "Deck not found" });
    }

    /* Use $pull operator to remove the specified deck from the array */
    await User.updateOne(
      { _id: req.userId },
      { $pull: { decks: { _id: req.params.id } } }
    );

    res.status(200).json({ message: "Deck deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;