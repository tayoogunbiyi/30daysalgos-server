const express = require("express");
const mongoose = require("mongoose");
const {isAdminOrGreater} = require('../../middleware/rolesMiddleware')
const { joiValidate } = require('express-joi');

const {questionSchema} = require('../../validation/validationSchemas')
const messages = require('../../services/responseMessages');
const {buildResponse} = require('../../services/responseBuilder');

const {buildDuplicateMessage} = messages;
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

router.post('/',joiValidate(questionSchema), isAdminOrGreater, async (req,res) => {
    try {
        const {title} = req.body;
        const exists = await Question.exists({title:title})
        if (exists){
            return res.status(400).json(
                buildResponse(
                    `Question with title ${buildDuplicateMessage(title)}`,
                    null,
                    false
                )
            ) 
        }
        const question = await Question.create(req.body)
        return res.status(201).json(
            buildResponse(
                `Created question ${messages.SUCCESS_MESSAGE}`,
            question,
            true
            )
        )
    } catch (error) {
        return res.status(500).json(
            buildResponse(error.message || messages.SERVER_ERROR,null,false)
        )   
    }
    
})

module.exports = router;