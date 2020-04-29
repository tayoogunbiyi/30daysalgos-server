const mongoose = require("mongoose");

const User = mongoose.model("User");
const Leaderboard = mongoose.model("Leaderboard");
const Submission = mongoose.model("Submission");

const { buildResponse } = require("../../services/responseBuilder");

const submissionController = (req, res) => {
  const fileObj = req.files["submission"];
  console.log(`Received file ${fileObj.name}.`);
  const userId = req.user.id;
  const questionId = req.params.id;
  const pointsObtained = 20;
  Leaderboard.updateUserPoints(userId, pointsObtained);
  Submission.createSubmission(userId, questionId, pointsObtained);

  const totalTestCases = 5;
  const passedTestCases = 2;
  res.status(200).json(
    buildResponse(
      "Submitted succesfully",
      {
        totalTestCases,
        passedTestCases,
        points: pointsObtained,
      },
      true
    )
  );
  if (totalTestCases == passedTestCases) {
    
  }
  // Leaderboard.sortAndSave();
};

module.exports = {
  submissionController,
};
