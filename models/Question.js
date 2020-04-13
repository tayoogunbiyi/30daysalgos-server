
const mongoose = require("mongoose");

const {
    Schema
} = mongoose;

const QuestionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    visibleBy:{
        type:Date,
        required:true,
    },
    examples: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Example',
        },
      ],
});

QuestionSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj["__v "]
    return obj;
};


module.exports = mongoose.model("Question", QuestionSchema);