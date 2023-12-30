const mongoose = require("mongoose");

/* Card Schema! Cards need to have fronts, backs, and starring status */

const cardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  starred: {type: Boolean, required: true }
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
