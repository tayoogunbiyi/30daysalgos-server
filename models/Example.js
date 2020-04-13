
const mongoose = require("mongoose");

const {
    Schema
} = mongoose;

const ExampleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    explanation:{
        type:String,
        required:true
    }
});

ExampleSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj["__v "]
    return obj;
};


module.exports = mongoose.model("Example", ExampleSchema);