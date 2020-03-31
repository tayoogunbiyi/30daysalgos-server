const expressJoi = require('express-joi');

const { Joi } = expressJoi;

const loginSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
};

const registrationSchema = {
  ...loginSchema,
  name: Joi.string().required(),
};


module.exports = {
  registrationSchema,
  loginSchema,
};
