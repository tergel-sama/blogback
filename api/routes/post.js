const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const cheackAuth = require("../middleware/check-auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

const Post = require("../models/post");

//UPDATE
router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const update = {};
  for (const obj of req.body) {
    update[obj.name] = obj.value;
  }
  Post.update(
    { _id: id },
    {
      $set: update,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Handling update worked",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});
//DELETE
router.delete("/:id", cheackAuth, (req, res, next) => {
  const id = req.params.id;
  Post.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});
//GET BY TAG NAME
router.get("/tag-of/:name", (req, res) => {
  Post.find({ tags: req.params.name })
    .sort({ _id: -1 })
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});
//REAL ALL GET
router.get("/real-all-posts", (req, res, next) => {
  Post.find()
    .sort({ _id: -1 })
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});
//ALL GET
router.get("/", (req, res, next) => {
  Post.find({ approve: 1 })
    .sort({ _id: -1 })
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});
//GET WAITING POST
router.get("/waiting", (req, res, next) => {
  Post.find({ approve: 0 })
    .sort({ _id: -1 })
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});
//Author posts
router.get("/author/:id", (req, res, next) => {
  const id = req.params.id;
  Post.find({ author: id })
    .sort({ _id: -1 })
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});
//1 GET
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) res.status(200).json(doc);
      else res.status(404).json({ message: "Олдсонгүй ээ!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
//POST
router.post("/", cheackAuth, upload.single("animeImage"), (req, res, next) => {
  console.log(req.file);
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    img: req.body.img,
    content: req.body.content,
    author: req.body.author,
    tags: req.body.tags,
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Handling post",
        status: "success",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
