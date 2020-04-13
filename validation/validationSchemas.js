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

const questionSchema = {
  title:Joi.string().required(),
  description:Joi.string().required(),
  visibleBy:Joi.date().required(),
}


module.exports = {
  registrationSchema,
  loginSchema,
  questionSchema,
};
