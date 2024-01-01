var mongoose = require("mongoose");

mongoose.connect( process.env.MONGODB_URI || "mongodb://0.0.0.0/test");

module.exports.User = require("./User.js");
module.exports.Deck = require("./Deck.js");
module.exports.Card = require("./Card.js");