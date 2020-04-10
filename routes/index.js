const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const User = mongoose.model("User");
const Leaderboard = mongoose.model("Leaderboard");
const { joiValidate } = require('express-joi');
const { registrationSchema, loginSchema, } = require('../validation/validationSchemas');
const messages = require('../services/responseMessages');

const {buildResponse} = require('../services/responseBuilder');

require("../config/passport-config")(passport);

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ title: "Express" });
});


router.post('/register', joiValidate(registrationSchema), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json(buildResponse(
      messages.EMAIL_NOT_AVAILABLE,
    ));
  }
  const newUser = new User(req.body);
  const hash = await User.generateHash(req.body.password);
  if (!hash) {
    return res.status(500).json(
      buildResponse(
        messages.SERVER_ERROR,
      ),
    );
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
        true,
      ),
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(buildResponse(messages.SERVER_ERROR));
  }
});

router.post('/login', joiValidate(loginSchema), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const response = buildResponse(
      messages.INVALID_CREDENTIALS,
    );
    return res.status(401).json(response);
  }

  const token = await user.generateJWT(req.body.password);
  if (!token) {
    const response = buildResponse(
      messages.INVALID_CREDENTIALS,
    );
    return res.status(401).json(response);
  }

  return res.json(buildResponse(
    `Logged in ${messages.SUCCESS_MESSAGE}`,
    {
      token,
    },
    true,
  ));
});

router.get('/leaderboard', async (req, res) => {
  const leaderboard = await Leaderboard.find({});
  return res.json(buildResponse(`Leaderboard fetch ${messages.SUCCESS_MESSAGE}`, {
    leaderboard
  }, true))
})

module.exports = router;
