const express = require("express");
const router = express.Router();
const isAuth = require("../utils/isAuth");
const remote = require("../controller/remote");
const passport = require("../passport/passport");
const validator = require("../utils/validator");
const multer = require("../multer/multer");

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
          usename: user.name,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

router.post("/sign-up", validator, remote.signup);

router.get("/pfpIMG/:image", remote.sendIMGS);

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
router.get("/nav-data", isAuth, remote.getNavData);

router.get("/search", isAuth, remote.search);
router.get("/settings", isAuth, remote.settings);
router.get("/dms", isAuth, remote.dms);
router.get("/dms/:wUser", isAuth, remote.dms);
router.get("/:username/post/:postId", isAuth, remote.getPost);
router.get("/:profile", isAuth, remote.viewProfile);

// posts //
router.post("/post", isAuth, multer.array("files", 4), remote.post);
router.delete("/deletePost", isAuth, remote.deletePost);

router.post("/like", isAuth, remote.like);
router.post("/repost", isAuth, remote.repost);

// comments //
router.post("/comment", isAuth, remote.comment);

// following + followers + blocking//

router.post("/follow/:thisID", isAuth, remote.followHandler);
router.post("/block/:thisID", isAuth, remote.blockHandler);

// dms //

router.get("/dms/searchUser", isAuth, remote.dmUserSearch);
router.get("/dms/msgSearch/", isAuth, remote.dmMsgSearch);
router.get("/dms/:wUser", isAuth, remote.one2oneDMS);
router.post("/check-block-status", isAuth, remote.checkBlockStatus);
router.post("/send-msg", isAuth, multer.array("files", 4), remote.sendMsg);
router.patch("/deleteMsg", isAuth, remote.deleteMsg);

// user settings //
router.patch(
  "/update-profile",
  isAuth,
  multer.single("pfp"),
  remote.updateProfileSettings,
);
router.get("/blocked-users", isAuth, remote.getBlockedUsers);

module.exports = router;
