const express = require("express");
const router = express.Router();
const { isAuth } = require("../utils/passportAuth");
const remote = require("../controller/remote");
const passport = require("../passport/passport");
const validator = require("../utils/validator");

router.get("/api/isAuth", isAuth, (req, res) => {
  res.status(200).json({
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

router.get("/for-you-feed", isAuth, remote.forYouFeed);
router.get("/for-you", isAuth, remote.forYouFeed);
router.get("/followingFeed", isAuth, remote.followingFeed);

router.get("/:profile", isAuth, remote.viewProfile);
router.get("/search", isAuth, remote.search);
router.get("/settings", isAuth, remote.settings);
router.get("/dms", isAuth, remote.dms);

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

// following + followers //

router.post("/follow:/:thisID", isAuth, remote.followThem);
router.delete("/unfollow:/:thisID", isAuth, remote.unfollowThem);

// dms //

router.get("/dms/:wUser", isAuth, remote.one2oneDMS);
router.post("/msg", isAuth, remote.sendMsg);
router.patch("/deleteMsg", isAuth, remote.deleteMsg);

// user settings //
router.patch("/update-profile", isAuth, remote.updateProfileSettings);
router.post("/block/:thisID", isAuth, remote.blockThem);
router.delete("/unblock/:thisID", isAuth, remote.unblockThem);
