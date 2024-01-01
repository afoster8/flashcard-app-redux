require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

app.use(allowCrossDomain);
app.use("/static", express.static("./public"));
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", function(req, res) {
  res.render("./frontend/src/index");
});

app.set("port", process.env.PORT || 3001);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test');

app.listen(app.get("port"), function () {
  process.on('uncaughtException', function (err) {
    console.log(err);
  });
  console.log("Express server listening on port %d in %s mode", app.get("port"), app.settings.env);
});