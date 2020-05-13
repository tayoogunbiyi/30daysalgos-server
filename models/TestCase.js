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
    required: true,
  },
});

TestCaseSchema.index({ question: 1, input: 1 }, { unique: true });

TestCaseSchema.statics.testAgainst = async function (questionId, userSolution) {
  const testCases = await this.find({ question: questionId });
  const expectedOutput = mapper(testCases, "input", "expectedOutput");
  const userOutput = mapper(userSolution, "input", "output");

  if (getObjLength(expectedOutput) !== getObjLength(userOutput)) {
    throw new Error(
      `Expected submission input of length ${getObjLength(
        expectedOutput
      )} and got length of ${getObjLength(userOutput)} (unique inputs count)`
    );
  }

  let passedTestCases = 0;
  for (const key in expectedOutput) {
    const userOp = userOutput[key];
    const correctOp = expectedOutput[key];
    if (correctOp === userOp) {
      passedTestCases += 1;
    }
  }
  return { passedTestCases, totalTestCases: testCases.length };
};

TestCaseSchema.statics.updateTestCase = async function (id, data) {
  return this.findOneAndUpdate(
    {
      _id: id,
    },
    data,
    {
      new: true,
    }
  );
};

TestCaseSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj["__v "];
  return obj;
};

TestCaseSchema.statics.deleteTestCase = function (id) {
  return this.deleteOne({ _id: id });
};

const mapper = (objectsArray, key1, key2) => {
  const newObj = {};
  objectsArray.forEach((obj) => {
    if (!(obj[key1] in newObj)) {
      newObj[obj[key1]] = obj[key2];
    }
  });
  return newObj;
};

const getObjLength = (obj) => {
  return Object.keys(obj).length;
};
module.exports = mongoose.model("TestCase", TestCaseSchema);
