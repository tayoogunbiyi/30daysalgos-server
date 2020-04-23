const mongoose = require("mongoose");
const express = require("express");
const { joiValidate } = require("express-joi");
const { userUpdateSchema } = require("../../validation/validationSchemas");
const messages = require("../../services/responseMessages");
const User = mongoose.model("User");

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

router.put("/", joiValidate(userUpdateSchema), async (req, res) => {
  if (!req.user) {
    return res.json(buildResponse(`Unable to fetch profile`, null, false));
  }
  try {
    const user = await User.updateUser(req.user.id, req.body);
    return res.json(buildResponse(`Updated profile`, user, true));
  } catch (error) {
    res
      .status(400)
      .json(buildResponse(error.message || messages.SERVER_ERROR), null, false);
  }
});

module.exports = router;
