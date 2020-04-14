const mongoose = require("mongoose");
const rolesWeightMap = require("../constants/rolesWeightMap");
const { checkValidId } = require("../utils/");
const { START_DATE } = require("../constants/questions");

const { Schema, Types } = mongoose;
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
  examples: [
    {
      type: Schema.Types.ObjectId,
      ref: "Example",
    },
  ],
});

QuestionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  // implement day functionality
  // obj['day'] = this.day;
  delete obj["__v "];
  return obj;
};

QuestionSchema.statics.findQ = function (id) {
  // throws error if failure
  checkValidId(id);
  return this.findById(id);
};
// QuestionSchema.virtual('day').get(function(){
//     const visibleBy = this.visibleBy;
//     console.log(visibleBy-START_DATE)
//     // converted to days by multiplying with 1.15741e-8
//     const daysElapsedSinceStart = parseInt((visibleBy - START_DATE)*1.15741e-8)
//     return daysElapsedSinceStart;
// });

QuestionSchema.statics.getAllQuestionsBefore = function (date) {
  try {
    return this.find({ visibleBy: { $lte: date } });
  } catch (error) {
    throw new Error("Could not fetch questions");
  }
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
