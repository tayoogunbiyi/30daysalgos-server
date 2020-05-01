const expressJoi = require("express-joi");

const { Joi } = expressJoi;

const loginSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
};

const registrationSchema = {
  ...loginSchema,
  name: Joi.string().required(),
};

const submissionSchema = {
  id: Joi.string().required(),
  solution: Joi.array().min(1).required(),
};

const questionSchema = {
  title: Joi.string().required(),
  description: Joi.string().required(),
  visibleBy: Joi.date().required(),
  hint: Joi.string().default(""),
};

const questionUpdateSchema = {
  // id - url param
  id: Joi.string().required(),
  title: Joi.string(),
  description: Joi.string(),
  visibleBy: Joi.date(),
  hint: Joi.string(),
};

const exampleSchema = {
  id: Joi.string().required(),
  input: Joi.string().required(),
  output: Joi.string().required(),
  explanation: Joi.string().required(),
};

const exampleUpdateSchema = {
  id: Joi.string().required(),
  input: Joi.string(),
  output: Joi.string(),
  explanation: Joi.string(),
};

const testCaseUpdateSchema = {
  id: Joi.string().required(),
  testCaseId: Joi.string().required(),
  input: Joi.string(),
  expectedOutput: Joi.string(),
};

const testCaseSchema = {
  id: Joi.string().required(),
  input: Joi.string().required(),
  expectedOutput: Joi.string().required(),
};

module.exports = {
  registrationSchema,
  loginSchema,
  questionSchema,
  exampleSchema,
  testCaseUpdateSchema,
  exampleUpdateSchema,
  questionUpdateSchema,
  testCaseSchema,
  submissionSchema,
};
