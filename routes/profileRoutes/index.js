const mongoose = require("mongoose");
const express = require("express");

// const User = mongoose.model("User");

const { buildResponse } = require("../../services/responseBuilder");

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.user) {
    return res.json(buildResponse(`Unable to fetch profile`, null, false));
  }
  delete req.user["role"];
  return res.json(
    buildResponse(`Profile fetched succesfully.`, req.user, true)
  );
});

module.exports = router;
