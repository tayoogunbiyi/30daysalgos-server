const mongoose = require("mongoose");
const { SERVER_ERROR } = require("../../constants/responseMessages");

const Question = mongoose.model("Question");
const Leaderboard = mongoose.model("Leaderboard");
const Submission = mongoose.model("Submission");
const TestCase = mongoose.model("TestCase");

const { buildResponse } = require("../../services/responseBuilder");

const submissionController = async (req, res) => {
  const userId = req.user.id;
  const questionId = req.params.id;
  const { solution } = req.body;
  try {
    const submissionResult = await TestCase.testAgainst(questionId, solution);
    // console.log(submissionResult);
    const { passedTestCases, totalTestCases } = submissionResult;
    const pointsObtained = await Question.getDuePoints(
      questionId,
      passedTestCases,
      totalTestCases
    );
    const submission = await Submission.createSubmission(
      userId,
      questionId,
      pointsObtained
    );
    if (pointsObtained !== 0 && submission && submission.isNew) {
      // console.log(submission);
      await Leaderboard.updateUserPoints(userId, pointsObtained);
    }
    res.status(200).json(
      buildResponse(
        "Submitted succesfully",
        {
          totalTestCases,
          passedTestCases,
          pointsObtained,
        },
        true
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(buildResponse(error.message || SERVER_ERROR, null, false));
  }
};

module.exports = {
  submissionController,
};
