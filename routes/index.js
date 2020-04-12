const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const authRoutes = require('./authRoutes')
const Leaderboard = mongoose.model("Leaderboard");
const messages = require('../services/responseMessages');

const { buildResponse } = require('../services/responseBuilder');

require("../config/passport-config")(passport);

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ title: "Express" });
});

router.use('/auth',authRoutes)

router.get('/leaderboard', async (req, res) => {
  const leaderboard = await Leaderboard.find({});
  return res.json(buildResponse(`Leaderboard fetch ${messages.SUCCESS_MESSAGE}`, {
    leaderboard
  }, true))
})



module.exports = router;
