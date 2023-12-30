const mongoose = require("mongoose");
const Deck = require("./Deck");

/* User Schema! Users need to have usernames, IDs, and pins. */

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userID: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  decks: [{ type: Deck.schema }], 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
