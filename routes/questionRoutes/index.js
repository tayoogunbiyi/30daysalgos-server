const express = require("express");
const mongoose = require("mongoose");
const {
  isAdminOrGreater,
  userCanViewQuestion,
} = require("../../middleware/rolesMiddleware");
const { joiValidate } = require("express-joi");

const { checkValidId, checkValidIdOnObj } = require("../../utils/");
const {
  questionSchema,
  questionUpdateSchema,
  exampleSchema,
} = require("../../validation/validationSchemas");
const messages = require("../../services/responseMessages");
const { buildResponse } = require("../../services/responseBuilder");

const { buildDuplicateMessage } = messages;
const Question = mongoose.model("Question");
const Example = mongoose.model("Example");

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
    const allQuestions = await Question.find({}).populate("examples");
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
    checkValidId(id);
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

router.put(
  "/:id",
  isAdminOrGreater,
  joiValidate(questionUpdateSchema),
  async (req, res) => {
    const { id } = req.params;
    try {
      checkValidId(id);
      const question = await Question.updateQ(id, req.body);
      return res.json(
        buildResponse(
          `Updated question with ${id} ${messages.SUCCESS_MESSAGE}`,
          question,
          true
        )
      );
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json(
          buildResponse(error.message || messages.SERVER_ERROR),
          null,
          false
        );
    }
  }
);

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

router.post(
  "/:id/examples",
  joiValidate(exampleSchema),
  isAdminOrGreater,
  async (req, res) => {
    const { id } = req.params;
    try {
      checkValidIdOnObj(id, Question);
      const example = await Example.create(req.body);
      const q = await Question.findQ(id);
      q.examples.push(example._id);
      q.save();
      return res.json(
        buildResponse(
          `Created example successfully`,
          {
            example,
            q,
          },
          true
        )
      );
    } catch (error) {
      res
        .status(400)
        .json(
          buildResponse(error.message || messages.SERVER_ERROR),
          null,
          false
        );
    }
  }
);
module.exports = router;
