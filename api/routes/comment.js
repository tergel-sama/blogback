const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const Comment = require("../models/comment");
const { emit } = require("../models/comment");

//UPDATE

router.patch("/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  const update = {};
  for (const obj of req.body) {
    update[obj.name] = obj.value;
  }
  Comment.update({ _id: id }, { $set: update })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Handling update worked",
      });
    })
    .catch((err) =>
      res.status(500).json({
        message: err,
      })
    );
});
//DELETE
router.delete("/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  Comment.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ status: "success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});
// ALL GET
router.get("/", (req, res) => {
  Comment.find()
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});
// 1 GET
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Comment.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "username",
        foreignField: "username",
        as: "userData",
      },
    },
    { $match: { postId: id } },
    { $project: { content: 1, "userData.img": 1, "userData.username": 1 } },
  ])
    .exec()
    .then((result) => {
      if (result) res.status(200).json(result);
      else res.status(404).json({ message: "Олдсонгүй ээ!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//POST

router.post("/", checkAuth, (req, res) => {
  const comment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    content: req.body.content,
    postId: req.body.postId,
    username: req.body.username,
  });
  comment
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Handling tag worked",
        status: "success",
        userId: req.userData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
