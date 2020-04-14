const express = require("express");
const mongoose = require("mongoose");
const {
  isAdminOrGreater,
  userCanViewQuestion,
} = require("../../middleware/rolesMiddleware");
const { joiValidate } = require("express-joi");

const { checkValidId } = require("../../utils/");
const { questionSchema } = require("../../validation/validationSchemas");
const messages = require("../../services/responseMessages");
const { buildResponse } = require("../../services/responseBuilder");

const { buildDuplicateMessage } = messages;
const Question = mongoose.model("Question");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const questionsBeforeCurrTime = await Question.getAllQuestionsBefore(
      Date.now()
    );
    return res.json(
      buildResponse(
        `Fetched questions before ${Date.now()} ${messages.SUCCESS_MESSAGE}`,
        questionsBeforeCurrTime,
        true
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(buildResponse(error.message || messages.SERVER_ERROR, null, false));
  }
});

router.get("/all", isAdminOrGreater, async (req, res) => {
  try {
    const allQuestions = await Question.find({});
    return res.json(
      buildResponse(
        `Fetched all questions ${messages.SUCCESS_MESSAGE}`,
        allQuestions,
        true
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(buildResponse(error.message || messages.SERVER_ERROR, null, false));
  }
});

router.post(
  "/",
  joiValidate(questionSchema),
  isAdminOrGreater,
  async (req, res) => {
    try {
      const { title } = req.body;
      const exists = await Question.exists({ title: title });
      if (exists) {
        return res
          .status(400)
          .json(
            buildResponse(
              `Question with title ${buildDuplicateMessage(title)}`,
              null,
              false
            )
          );
      }
      const question = await Question.create(req.body);
      return res
        .status(201)
        .json(
          buildResponse(
            `Created question ${messages.SUCCESS_MESSAGE}`,
            question,
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          buildResponse(error.message || messages.SERVER_ERROR, null, false)
        );
    }
  }
);

router.get("/:id", userCanViewQuestion, async (req, res) => {
  try {
    const { id } = req.params;
    checkValidId();
    const question = await Question.findQ(id).populate("examples");
    if (!question) throw Error("Question Not Found!");
    return res.json(
      buildResponse(
        `Fetched question with ${id} ${messages.SUCCESS_MESSAGE}`,
        question,
        true
      )
    );
  } catch (error) {
    let status = 500;
    if (error.message && error.message.includes("Not Found!")) {
      status = 404;
    }
    res
      .status(status)
      .json(buildResponse(error.message || messages.SERVER_ERROR), null, false);
  }
});

router.delete("/:id", isAdminOrGreater, async (req, res) => {
  try {
    const { id } = req.params;
    checkValidId(id);
    const result = await Question.deleteQ(id);
    if (!result.deletedCount) throw Error("Unable to delete question");
    return res.json(
      buildResponse(
        `Deleted question with ${id} ${messages.SUCCESS_MESSAGE}`,
        null,
        true
      )
    );
  } catch (error) {
    res
      .status(400)
      .json(buildResponse(error.message || messages.SERVER_ERROR), null, false);
  }
});
module.exports = router;
