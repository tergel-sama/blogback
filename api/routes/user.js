const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

router.patch("/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  const update = req.body.update;
  User.update(
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

router.get("/post-creator/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .select("username email description img")
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

router.get("/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  User.findById(id)
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

router.post("/signup", (req, res) => {
  User.find({ email: req.body.email, username: req.body.username })
    .exec()
    .then((result) => {
      if (result.length >= 1) {
        return res.status(409).json({
          message: "username or email exist",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) =>
                res.status(201).json({ message: "User created" })
              )
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed ",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed ",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              userType: user[0].type,
              userImg:user[0].img,
              username:user[0].username
            },
            "secret",
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        return res.status(401).json({
          message: "Auth failed ",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/all/desc", (req, res) => {
  User.find({ type: 1 })
    .select("username img description")
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

router.get("/", checkAuth, (req, res) => {
  res.status(200).json({ userData: req.userData });
});

router.delete("/:userId", (req, res) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
