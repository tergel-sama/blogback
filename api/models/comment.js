const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  content: String,
  postId:String,
  username:String
});

module.exports = mongoose.model("comment", commentSchema);
