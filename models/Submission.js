const mongoose = require("mongoose");
const Question = mongoose.model("Question");

const { Schema } = mongoose;

const SubmissionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  attempts: {
    type: Schema.Types.Number,
    default: 1,
  },
  completed: {
    type: Schema.Types.Boolean,
    // default will later be changed to false.
    // true for dev purposes
    default: false,
  },
  maxpointsObtained: {
    type: Schema.Types.Number,
    default: 0,
  },
});

SubmissionSchema.index({ user: 1, question: 1 }, { unique: true });

SubmissionSchema.statics.createSubmission = async function (
  userId,
  questionId,
  pointsObtained
) {
  try {
    const submission = await this.findOne({
      user: userId,
      question: questionId,
    });
    const q = await Question.findById(questionId);
    if (pointsObtained > q.pointsObtainable) {
      throw new Error(
        `Invalid points obtained ${pointsObtained}, max of ${q.pointsObtainable}`
      );
    }
    if (!submission) {
      const newSubmission = new this();
      (newSubmission.user = userId), (newSubmission.question = questionId);
      newSubmission.maxpointsObtained = pointsObtained;
      newSubmission.completed = pointsObtained === q.pointsObtainable;
      await newSubmission.save();
    } else {
      submission.maxpointsObtained = Math.max(
        q.pointsObtainable,
        submission.maxpointsObtained,
        pointsObtained
      );
      submission.attempts += 1;
      submission.completed = pointsObtained === q.pointsObtainable;
      await submission.save();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

SubmissionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj["__v "];
  return obj;
};

module.exports = mongoose.model("Submission", SubmissionSchema);
