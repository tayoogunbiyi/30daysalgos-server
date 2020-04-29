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

TestCaseSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj["__v "];
  return obj;
};

module.exports = mongoose.model("TestCase", TestCaseSchema);
