const express = require("express");
const mongoose = require("mongoose");

const fileUpload = require("express-fileupload");
const {
  isAdminOrGreater,
  userCanViewQuestion,
} = require("../../middleware/rolesMiddleware");
const { joiValidate } = require("express-joi");

const { submissionController } = require("./questionSubmission");
const { checkValidId, checkValidIdOnObj } = require("../../utils/");
const {
  questionSchema,
  questionUpdateSchema,
  exampleSchema,
  exampleUpdateSchema,
} = require("../../validation/validationSchemas");
const messages = require("../../services/responseMessages");
const { buildResponse } = require("../../services/responseBuilder");

const { FILE_UPLOADER_CONFIG } = require("../../constants/uploads");

const { buildDuplicateMessage } = messages;
const Question = mongoose.model("Question");
const Example = mongoose.model("Example");

const router = express.Router();

router.post(
  "/submit/:id",
  fileUpload(FILE_UPLOADER_CONFIG),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      await checkValidIdOnObj(id, Question);
      next();
    } catch (error) {
      return res
        .status(400)
        .json(
          buildResponse(error.message || messages.SERVER_ERROR, null, false)
        );
    }
  },
  submissionController
);
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
    await checkValidIdOnObj(id, Question);
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
      await checkValidIdOnObj(id, Question);
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
    //checkValidId(id);
    await checkValidIdOnObj(id, Question);
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
      await checkValidIdOnObj(id, Example);
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

router.put(
  "/examples/:id",
  joiValidate(exampleUpdateSchema),
  isAdminOrGreater,
  async (req, res) => {
    const { id } = req.params;
    try {
      await checkValidIdOnObj(id, Example);
      const example = await Example.updateExample(id, req.body);
      return res.json(
        buildResponse(
          `Updated example with ${id} ${messages.SUCCESS_MESSAGE}!!!`,
          example,
          true
        )
      );
    } catch (error) {
      console.log("Error!??", error.message);
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

router.delete("/examples/:id", isAdminOrGreater, async (req, res) => {
  try {
    const { id } = req.params;
    await checkValidIdOnObj(id, Example);
    const result = await Example.deleteOne({ _id: id });
    if (!result.deletedCount) throw Error("Unable to delete example");
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
