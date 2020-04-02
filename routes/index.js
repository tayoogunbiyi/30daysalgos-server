const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const User = mongoose.model("User");
const { joiValidate } = require('express-joi');
const { registrationSchema, loginSchema, } = require('../validation/validationSchemas');
const messages = require('../services/responseMessages');

const { buildResponse } = require('../services/responseBuilder');

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

router.get("/user", async (req, res) => {

  if (!req.body.email && !req.body.name) {
    const response = buildResponse(
      messages.MISSING_FIELD,
    );
    return res.status(401).json(response);
  }
  if (!req.headers.authorization) {
    const response = buildResponse(
      messages.INVALID_TOKEN,
    );
    return res.status(403).json(response);

  }
  try {
    const user = new User(req.body)
    const bearer = req.headers.authorization.split(' ');
    const bearerToken = bearer[1]
    const verify = await user.verifyJWT(bearerToken)
  console.log(verify)

    if (verify) {
      let userData;

      if (user.name) {
        userData = await User.findOne({ name: req.body.name })
    }
    else if (user.body.email) {
        userData = await User.findOne({ email: req.body.email })
    }

    if (!userData) {
      const response = buildResponse(
        `User  ${messages.NOT_FOUND}`,
        false        
      )
      return res.status(404).json(response);
    }

      user.password = undefined
      const response = buildResponse(
        `User returned ${messages.SUCCESS_MESSAGE}`,
        userData.toJSON(),
        true,
      )
      return res.status(200).json(response)

    } else  {
      const response = buildResponse(
        messages.INVALID_TOKEN,
      );
      return res.status(403).json(response);

    }
  
  } catch (error) {
    console.log(error);
    return res.status(500).json(buildResponse(messages.SERVER_ERROR));
  }
})

module.exports = router;
