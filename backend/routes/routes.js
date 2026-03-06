const express = require("express");
const router = express.Router();
const { isAuth } = require("../utils/passportAuth");
const remote = require("../controller/remote");
const passport = require("../passport/passport");
const validator = require("../utils/validator");

router.get("/api/isAuth", isAuth, (req, res) => {
  res.json({
    user: req.user,
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });
  });
});

router.post("/sign-up", isAuth, validator, remote.signup);

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true });
  });
});

router.get("/", isAuth, remote.forYouFeed);
router.get("/following", isAuth, remote.followingFeed);

router.get("/profile", isAuth, remote.profile);
router.get("/search", isAuth, remote.search);
router.get("/settings", isAuth, remote.settings);

// posts //
router.post("/post", isAuth, remote.post);
router.delete("/deletePost", isAuth, remote.deletePost);

router.post("/repost", isAuth, remote.repost);
router.delete("/removeRepost", isAuth, remote.removeRepost);

router.post("/like", isAuth, remote.like);
router.delete("/removeLike", isAuth, remote.removeLike);

// comments //
router.post("/comment", isAuth, remote.comment);
router.post("/deleteComment", isAuth, remote.deleteComment);

// search //
router.get("/search", isAuth, remote.search);

// update profile //
router.patch("/update-profile", isAuth, remote.updateProfile);
