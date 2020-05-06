const Joi = require("@hapi/joi");
const { START_DATE } = require("../constants/questions");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

const submissionSchema = Joi.object({
  solution: Joi.array()
    .items(
      Joi.object({
        input: Joi.string().required(),
        output: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
});

const questionSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  visibleBy: Joi.date().required(),
  hint: Joi.string().default(""),
});

const questionUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  visibleBy: Joi.date(),
  hint: Joi.string(),
});

const exampleSchema = Joi.object({
  input: Joi.string().required(),
  output: Joi.string().required(),
  explanation: Joi.string().required(),
});

const exampleUpdateSchema = Joi.object({
  input: Joi.string(),
  output: Joi.string(),
  explanation: Joi.string(),
});

const testCaseUpdateSchema = Joi.object({
  input: Joi.string(),
  expectedOutput: Joi.string(),
});

const testCaseSchema = Joi.object({
  input: Joi.string().required(),
  expectedOutput: Joi.string().required(),
});

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
