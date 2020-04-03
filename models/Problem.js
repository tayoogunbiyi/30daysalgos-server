const mongoose = require('mongoose');
const {START_DATE} = require('../constants/problem')

const {Schema } = mongoose;

const ProblemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    serializedTestCases:{
        type:String,
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now,
    },
    makeVisibleBy:{
        type:Date,
        required:true,
        unique:true,
    }
})

// userSchema.virtual('domain').get(function() {
//     return this.email.slice(this.email.indexOf('@') + 1);
//   });
ProblemSchema.virtual('day').get(function(){
    const makeVisibleBy = this.makeVisibleBy;
    // multiplying by constant to convert millisecs to days
    const daysElapsedSinceStart = parseInt((makeVisibleBy - START_DATE)*1.15741e-8)
    return daysElapsedSinceStart;
});

module.exports = mongoose.model('Problem',ProblemSchema)
