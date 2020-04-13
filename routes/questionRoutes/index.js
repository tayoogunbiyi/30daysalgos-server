const express = require("express");
const mongoose = require("mongoose");
const {isAdminOrGreater} = require('../../middleware/rolesMiddleware')
const { joiValidate } = require('express-joi');
const { registrationSchema, loginSchema, } = require('../../validation/validationSchemas');
const messages = require('../../services/responseMessages');
const {buildResponse} = require('../../services/responseBuilder');
const router = express.Router();




router.get('/',async (req,res) => {
    return res.json({'ok':true})
})

router.post('/',isAdminOrGreater, async (req,res) => {
    return res.json({
        user:req.user
    })
})

module.exports = router;