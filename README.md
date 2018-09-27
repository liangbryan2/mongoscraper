# /r/ProgrammerHumor Scraper
This project scrapes the front page of the subreddit [ProgrammerHumor](https://www.reddit.com/r/ProgrammerHumor/). It then displays the posts with images on the main page. Reddit has an API so there is no need to scrape the site, but this project was mainly to practice my scraping skills.

## Getting Started
The website can be found here:

[Scraper](https://programmerhumorscraper.herokuapp.com/)

![index](/public/index.jpg)
### Scraping
You can click the red button on the top of the page to scrape the subreddit and it'll return the currently displayed posts on the first page of the subreddit.

### Adding Notes
Click on an image to add a note. The notes can be edited by anyone so don't expect it to stay the same.

### Reddit post
The final thing is the link to the reddit post to view all the comments.

## Building the webpage
### Technologies Used
* [Express.js](http://expressjs.com/)
* [express-handlebars](https://www.npmjs.com/package/express-handlebars)
* [Cheerio](https://www.npmjs.com/package/cheerio)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [request](https://www.npmjs.com/package/request)

### [MongoDB](https://www.mongodb.com/)
I store all the information I scraped into a MongoDB database. This is the first time I am using MongoDB and Mongoose, the ORM associated with MongoDB.

Mongoose allows us to create models like so.
``` javascript
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PostSchema = new Schema({
    title: {
        unique: true,
        type: String
    },
    link: {
        unique: true,
        type: String,
        validate: [
            function (input) {
                if (input.includes("undefined")) {
                    return false;
                } else {
                    return true;
                }
            }
        ]
    },
    image: {
        unique: true,
        required: true,
        type: String
    },
    note: {
        type: Schema.Types,
        ref: "Note"
    }
});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;
```
This Post model has a Note model attached to it. That allows us to save notes for individual posts.
```javascript
unique: true
```
These lines only allow unique posts to be stored in our database so we don't have reposts.

## Scraping
The following code is all the scraping I do in this project. The biggest trouble I had was when I scraped for images, only the imgur links would be returned even though the i.redd.it images had the same exact class. I dug arround to find other images that I could scrape and finally found the class you see below.
``` javascript
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
```
## Handlebars
The front end is rendered through Handlebars. I have used handlebars in the past and the main purpose of this project was to learn scraping and mongoose, so there isn't any fancy handlebars stuff going on.
```html
<div class="post slide">
    <h2 class="outline">{{this.title}}</h2>
    <img class="img" src="{{this.image}}">
    <a class="link uk-button" href="{{this.link}}"><i class="fa fa-reddit" style="font-size:40px;color:red"></i>Reddit Post</a>
</div>
```
Handlebars allows us to easily place the value of our variables into the html. There's no need for jQuery DOM manipulation through .append()s and we do not have to create new divs everytime we want to append.
```javascript
var header = $("<h2>");
header.text("Amazing Reddit Post");
var img = $("<img>");
img.attr("href", post.imglink);
$("<div>").append(header);
```
Example code of what jQuery DOM manipulation would look like if I remembered the syntax correctly.

## Learning Points
* Learning how to scrape using Cheerio and Request
* Learning how to use MongoDB

## View my other projects
[Github](https://github.com/liangbryan2)