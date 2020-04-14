const mongoose = require("mongoose");

const { Schema } = mongoose;

const ExampleSchema = new Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

ExampleSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj["__v "];
  return obj;
};

module.exports = mongoose.model("Example", ExampleSchema);
