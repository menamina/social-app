const express = require("express");
const router = express.Router();
const { isAuth } = require("../utils/passportAuth");
const remote = require("../controller/remote");
const validators = require("../utils/validator");

router.post("/login");
//passport local
router.post("/sign-up");

router.get("/", isAuth, remote.home);
router.get("/settings", isAuth, remote.settings);
router.get("/search", isAuth, remote.home);
