const mongoose = require("mongoose");

const Leaderboard = mongoose.model("Leaderboard");
const Submission = mongoose.model("Submission");

const { buildResponse } = require("../../services/responseBuilder");

const submissionController = (req, res) => {
  const fileObj = req.files["submission"];
  console.log(`Received file ${fileObj.name}.`);
  const userId = req.user.id;
  const questionId = req.params.id;
  // compute points obtained here...
  const pointsObtained = 20;
  Leaderboard.updateUserPoints(userId, pointsObtained);
  Submission.createSubmission(userId, questionId, pointsObtained);
  res.status(200).json(
    buildResponse(
      "Submitted succesfully",
      {
        totalTestCases: 5,
        passedTestCases: 2,
        points: pointsObtained,
      },
      true
    )
  );
  Leaderboard.sortAndSave();
};

module.exports = {
  submissionController,
};
