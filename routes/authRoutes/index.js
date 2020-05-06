const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const validator = require("express-joi-validation").createValidator({});
const User = mongoose.model("User");
const {
  registrationSchema,
  loginSchema,
} = require("../../validation/validationSchemas");
const messages = require("../../constants/responseMessages");
const { buildResponse } = require("../../services/responseBuilder");
const router = express.Router();

router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  async function (req, res) {
    if (!req.user) {
      return res.status(400).json(buildResponse(messages.INVALID_CREDENTIALS));
    }
    const user = req.user;
    const token = await user.generateOauthJWT();
    if (!token) {
      return res.status(500).json(buildResponse(messages.SERVER_ERROR));
    }

    return res.json(
      buildResponse(
        `Logged in ${messages.SUCCESS_MESSAGE}`,
        {
          token,
        },
        true
      )
    );
  }
);

router.post("/register", validator.body(registrationSchema), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json(buildResponse(messages.EMAIL_NOT_AVAILABLE));
  }
  const newUser = new User(req.body);
  const hash = await User.generateHash(req.body.password);
  if (!hash) {
    return res.status(500).json(buildResponse(messages.SERVER_ERROR));
  }
  newUser.password = hash;
  try {
    newUser.save();
    return res.status(201).json(
      buildResponse(
        `Registered ${messages.SUCCESS_MESSAGE}`,
        {
          ...newUser.toJSON(),
        },
        true
      )
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(buildResponse(messages.SERVER_ERROR));
  }
});

router.post("/login", validator.body(loginSchema), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const response = buildResponse(messages.INVALID_CREDENTIALS);
    return res.status(401).json(response);
  }

  const token = await user.generateJWT(req.body.password);
  if (!token) {
    const response = buildResponse(messages.INVALID_CREDENTIALS);
    return res.status(401).json(response);
  }

  return res.json(
    buildResponse(
      `Logged in ${messages.SUCCESS_MESSAGE}`,
      {
        token,
      },
      true
    )
  );
});

module.exports = router;
