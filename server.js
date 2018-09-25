// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/programmerhumor"

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});