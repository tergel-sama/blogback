const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  img: String,
  content: Object,
  author: String,
  tags: Array,
  approve: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes:{ type: Number, default: 0 }
});

module.exports = mongoose.model("post", postSchema);
