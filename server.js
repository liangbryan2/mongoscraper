// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");
// Require request and cheerio. This makes the scraping possible
var axios = require("axios");
var request = require("request");
var cheerio = require("cheerio");
var db = require("./models");
// Initialize Express
var app = express();
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/programmerhumor"
var PORT = 3000;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(logger("dev"));
app.use(express.static("public"));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Routes
app.get("/scrape", function (req, res) {
  request("https://www.reddit.com/r/ProgrammerHumor/hot/", function (error, response, html) {
    if (error) {
      console.log(error)
    } else {
      var $ = cheerio.load(html);
      $("div.scrollerItem").each(function (i, element) {
        var results = {};
        results.image = $(element).find("img[class='_2_tDEnGMLxpM6uOa2kaDB3 media-element']").attr("src");
        results.link = "https://www.reddit.com" + $(element).find("div.s1ua9il2-1.fNYpwc").find("a").attr("href");
        results.title = $(element).find("h2.s1ua9il2-0").text();
        // console.log(results.image);
        db.Post.create(results).then(function (dbPost) {
          // console.log(dbPost);
        }).catch(function (err) {
          // return res.json(err);
        })
      })
    }
    res.send("Scrape Complete");
  })
})

app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});