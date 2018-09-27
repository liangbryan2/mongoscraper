// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require('express-handlebars');
var db = require("./models");
// Initialize Express
var app = express();
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/programmerhumor"
var PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(logger("dev"));
app.use(express.static("public"));
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

app.get("/", function (req, res) {
  db.Post.find({})
    .populate("note")
    .sort({"_id": -1})
    .then(function (dbPost) {
      var obj = {
        post: dbPost
      }
      res.render("index", obj);
  })
})

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
        db.Post.create(results).then(function (dbPost) {
          console.log(dbPost);
        }).catch(function (err) {
          return res.json(err);
        })
      })
    }
    res.send("Scrape Complete");

  })
})

app.get("/posts", function (req, res) {
  db.Post.find({})
    .populate("note")
    .then(function (dbPost) {
      res.json(dbPost);
    })
    .catch(function (err) {
      res.json(err);
    })
})

app.get("/posts/:id", function (req, res) {
  db.Post.findOne({
      _id: req.params.id
    })
    .populate("note")
    .then(function (dbPost) {
      res.json(dbPost);
    })
    .catch(function (err) {
      res.json(err);
    })
})

app.post("/posts/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Post.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      })
    })
    .then(function (dbPost) {
      res.json(dbPost)
    })
    .catch(function (err) {
      res.json(err);
    });
})

app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});