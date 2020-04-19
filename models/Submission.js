const mongoose = require("mongoose");

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
  const submission = await this.findOne({ user: userId, question: questionId });
  if (!submission) {
    const newSubmission = new this();
    (newSubmission.user = userId), (newSubmission.question = questionId);
    newSubmission.maxpointsObtained = pointsObtained;
    newSubmission.save();
  } else {
    submission.maxpointsObtained = Math.max(
      submission.maxpointsObtained,
      pointsObtained
    );
    submission.attempts += 1;
    await submission.save();
  }
};

SubmissionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj["__v "];
  return obj;
};

module.exports = mongoose.model("Submission", SubmissionSchema);
