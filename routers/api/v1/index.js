const express = require("express");
const router = express.Router();
const passport = require("passport");

router.use("/user", require("./user"));

router.use("/habit", passport.authenticate("jwt", {session: false}), require("./habit"));

router.use("/status", passport.authenticate("jwt", {session: false}), require("./status"));

module.exports = router;