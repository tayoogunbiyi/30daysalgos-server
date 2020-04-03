const mongoose = require("mongoose");
const Problem = mongoose.model("Problem");

const createProblem = (req,res) => {

    console.log(req.body)
    return res.json({'ok':true})
}

module.exports = {
    createProblem,
}