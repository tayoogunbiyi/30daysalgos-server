const mongoose = require("mongoose");

const { Schema } = mongoose;

const TestCaseSchema = new Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
});

TestCaseSchema.statics.testAgainst = async function (questionId, userSolution) {
  const testCases = await this.find({ question: questionId });
  if (testCases.length != userSolution.length) {
    throw new Error(
      `Expected input of length ${testCases.length} and got length of ${userSolution.length}`
    );
  }
  let passedTestCases = 0;
  for (let j = 0; j < testCases.length; j++) {
    const output = userSolution[j];
    const { expectedOutput } = testCases[j];
    if (output === expectedOutput) {
      passedTestCases += 1;
    }
  }
  return { passedTestCases, totalTestCases: testCases.length };
};

TestCaseSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj["__v "];
  return obj;
};

module.exports = mongoose.model("TestCase", TestCaseSchema);
