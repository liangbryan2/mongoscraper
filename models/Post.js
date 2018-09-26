var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PostSchema = new Schema({
    title: {
        type: String
    },
    link: {
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