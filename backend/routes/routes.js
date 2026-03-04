const express = require("express");
const router = express.Router();
const { isAuth } = require("../utils/passportAuth");
const remote = require("../controller/remote");
const passport = require("../passport/passport");
const validators = require("../utils/validator");

router.get("/api/isAuth", isAuth, (req, res){

})

router.post("/login");
//passport local
router.post("/sign-up");

router.post("/logout", (req, res){

})

router.get("/", isAuth, remote.home);
router.get("/profile", isAuth, remote.profile);
router.get("/search", isAuth, remote.home);
router.get("/settings", isAuth, remote.settings);


// posts // 
router.post("/post", isAuth, remote.post)
router.delete("/deletePost", isAuth, remote.deletePost)
router.post("/repost", isAuth, remote.repost)
router.delete("/removeRepost", isAuth, remote.removeRepost)

// comments //
router.post("/comment", isAuth, remote.comment)
router.post("/deleteComment", isAuth, remote.deleteComment)

// search //
router.get("/search", isAuth, remote.search)

// update profile //
router.patch("/update-profile", isAuth, remote.updateProfile)
