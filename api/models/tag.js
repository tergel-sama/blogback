const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
});

module.exports = mongoose.model("tag", tagSchema);
