const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  img:String,
  content: Object,
  author: String,
  tags:Array
});

module.exports = mongoose.model("post", postSchema);
