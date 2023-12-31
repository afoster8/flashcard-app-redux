const mongoose = require("mongoose");
const Card = require("./Card");

/* Deck Schema! Decks need to have names and cards, which have their own requirements */

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folder: [{ type: String }],
  cards: [{ type: Card.schema }],
});

const Deck = mongoose.model("Deck", deckSchema);

module.exports = Deck;
