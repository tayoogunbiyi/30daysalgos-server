const mongoose = require("mongoose");

const Leaderboard = mongoose.model("Leaderboard");

const { buildResponse } = require("../../services/responseBuilder");

const submissionController = (req, res) => {
  const fileObj = req.files["submission"];
  console.log(`Received file ${fileObj.name}.`);
  // ensure multiple submissions don't count.
  // console.log(req.user);
  Leaderboard.updateUserPoints(req.user.id, 10);
  // skeptical about leaving it here... delays users request

  res.status(200).json(
    buildResponse(
      "Submitted succesfully",
      {
        totalTestCases: 5,
        passedTestCases: 2,
        points: 10,
      },
      true
    )
  );
  Leaderboard.sortAndSave();
};

module.exports = {
  submissionController,
};
