const mongoose = require("mongoose");
const rolesWeightMap = require("../constants/rolesWeightMap");
const { checkValidId } = require("../utils/");
const { START_DATE } = require("../constants/questions");

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const ADMIN_WEIGHT = rolesWeightMap.ADMIN;

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  visibleBy: {
    type: Date,
    required: true,
    unique: true,
  },
  hint: {
    type: String,
    default: "No hint available!",
  },
  pointsObtainable: {
    type: Number,
    default: 20,
  },
  examples: [
    {
      type: Schema.Types.ObjectId,
      ref: "Example",
    },
  ],
  testCases: [
    {
      type: Schema.Types.ObjectId,
      ref: "TestCase",
    },
  ],
});

QuestionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj["day"] = this.day;
  // implement day functionality
  // obj['day'] = this.day;
  delete obj["__v "];
  return obj;
};

QuestionSchema.statics.addTestCase = async function (questionId, testCaseId) {
  try {
    if (!testCaseId) throw new Error("Invalid testcase id");
    const q = await this.findById(questionId);
    q.testCases.push(testCaseId);
    await q.save();
  } catch (error) {
    throw new Error(error.message || "An error occured while saving testcase.");
  }
};

QuestionSchema.statics.getDuePoints = async function (
  id,
  passedTestCases,
  totalTestCases
) {
  try {
    const q = await this.findById(id);
    const multiplier = passedTestCases / totalTestCases;
    if (multiplier === Infinity) {
      throw new Error("Invalid total test cases");
    }
    if (!q || q === undefined || q === null) {
      throw new Error("Invalid question id");
    }
    return Math.floor(multiplier * q.pointsObtainable);
  } catch (error) {
    throw new Error(error.message || "An error occured.");
  }
};

QuestionSchema.statics.findQ = function (id) {
  // throws error if failure
  checkValidId(id);
  return this.findById(id);
};

QuestionSchema.virtual("day").get(function () {
  const { visibleBy } = this;
  // converted to days by multiplying with 1.15741e-8
  const daysElapsedSinceStart = parseInt((visibleBy - START_DATE) * 1.15741e-8);
  return daysElapsedSinceStart;
});

QuestionSchema.statics.getAllQuestionsBefore = function (date) {
  try {
    return this.find({ visibleBy: { $lte: date } })
      .sort("visibleBy")
      .populate("examples")
      .populate("testCases", "input");
  } catch (error) {
    throw new Error("Could not fetch questions");
  }
};

QuestionSchema.statics.deleteQ = function (id) {
  checkValidId(id);
  return this.deleteOne({ _id: id });
};

QuestionSchema.statics.userCanView = async function (userRole, __id) {
  const userRoleWeight = rolesWeightMap[userRole];
  if (!userRoleWeight || userRoleWeight < ADMIN_WEIGHT) {
    const dateFilter = {
      $lte: new Date(),
    };
    const isDue = await this.exists({
      _id: new ObjectId(__id),
      visibleBy: dateFilter,
    });
    return isDue;
  }
  return true;
};

QuestionSchema.statics.updateQ = async function (id, data) {
  //MyModel.findOneAndUpdate(query, req.newData, {upsert: true}
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

// QuestionSchema.statics.get = async function (user, questionId) {
//   if (!user || !questionId || !mongoose.isValidObjectId(questionId)) {
//     return false;
//   }
//   const extraDateFilterObj = {
//     visibleBy: {
//       $lte: Date.now(),
//     },
//   };
//   const question = await this.findIfExists(questionId, extraDateFilterObj);
// };

module.exports = mongoose.model("Question", QuestionSchema);
