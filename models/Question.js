
const mongoose = require("mongoose");
const {START_DATE} = require('../constants/questions.js')

const {
    Schema
} = mongoose;

const QuestionSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique:true,
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
        unique:true,
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
    // implement day functionality
    // obj['day'] = this.day;
    delete obj["__v "]
    return obj;
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
        return this.find({ visibleBy: { $lte: date } })
    } catch (error) {
        throw new Error('Could not fetch questions')
    }
}


module.exports = mongoose.model("Question", QuestionSchema);