const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const post = require("./api/routes/post");
const tag = require("./api/routes/tag");
const signup = require("./api/routes/user");
const comment = require("./api/routes/comment");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

//DB Connections
mongoose.connect(
  "mongodb+srv://dbUser:dbUserPassword@blog.jz13c.mongodb.net/<dbname>?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);
//settings
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connections checkers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT , POST , PATCH , DELETE , GET"
    );
    return res.status(200).json({});
  }
  next();
});

//Routes
app.use("/post", post);
app.use("/tag", tag);
app.use("/user", signup);
app.use("/comment", comment);
app.use(express.static(path.join(__dirname, "./animequizgui/build")));
//Error handlers
app.use((req, res, next) => {
  const error = new Error("олдсонгүй");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      name: error.message,
    },
  });
});
//Export
module.exports = app;
