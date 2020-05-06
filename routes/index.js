const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const authRoutes = require("./authRoutes");
// const questionRoutes = require("./questionRoutes");
const profileRoutes = require("./profileRoutes");
const leaderboardRoutes = require("./leaderboardRoutes");

require("../config/passport-config")(passport);

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ title: "Express" });
});

router.use("/auth", authRoutes);
// router.use("/questions", passport.authenticate("jwt"), questionRoutes);
router.use("/user", passport.authenticate("jwt"), profileRoutes);
router.use("/leaderboards", leaderboardRoutes);

module.exports = router;
