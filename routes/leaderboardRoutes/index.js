const mongoose = require("mongoose");
const express = require("express");

const Leaderboard = mongoose.model("Leaderboard");

const { buildResponse } = require("../../services/responseBuilder");

const router = express.Router();

router.get("/", async (req, res) => {
  const leaderboard = await Leaderboard.find({})
    .sort({ points: -1 })
    .populate("user", "name email");
  return res.json(
    buildResponse(
      `Leaderboard fetched succesfully.`,
      {
        leaderboard,
      },
      true
    )
  );
});

module.exports = router;
