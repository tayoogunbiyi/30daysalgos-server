const { buildResponse } = require("../../services/responseBuilder");

const submissionController = (req, res) => {
  const fileObj = req.files["submission"];
  console.log(`Received file ${fileObj.name}.`);
  console.log(req.user);
  return res.status(200).json(
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
};

module.exports = {
  submissionController,
};
