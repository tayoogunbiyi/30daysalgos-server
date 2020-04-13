const express = require("express");
const mongoose = require("mongoose");
const {isAdminOrGreater} = require('../../middleware/rolesMiddleware')

const messages = require('../../services/responseMessages');
const {buildResponse} = require('../../services/responseBuilder');

const Question = mongoose.model('Question');

const router = express.Router();


router.get('/',async (req,res) => {
    try {
    const questionsBeforeCurrTime = await Question.getAllQuestionsBefore(Date.now());
    return res.json(
        buildResponse(
            `Fetched questions before ${Date.now()} ${messages.SUCCESS_MESSAGE}`,
            questionsBeforeCurrTime,
            true
        )
    )
    } catch (error) {
        return res.status(500).json(
            buildResponse(error.message || messages.SERVER_ERROR,null,false)
        )
    }
})

router.get('/all',async (req,res) => {
    try {
        const allQuestions = await Question.find({})
        return res.json(
            buildResponse(
                `Fetched all questions ${messages.SUCCESS_MESSAGE}`,
                allQuestions,
                true
            )
        )
        } catch (error) {
            return res.status(500).json(
                buildResponse(error.message || messages.SERVER_ERROR,null,false)
            )
        }
})

router.post('/',isAdminOrGreater, async (req,res) => {
    return res.json({
        user:req.user
    })
})

module.exports = router;