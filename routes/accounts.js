'use strict';

const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Account = require('../models').accounts;

const router = express.Router();

router.post('/', async (req, res, next) => {
    const { error } = validateAccount(req.body);
    if(error) return res.status(400).send(JSON.stringify(error.details[0].message));

    let account = await Account.findOne({ email_address: req.body.email_address });
    if(account) return res.status(400).send(JSON.stringify('Account already registered'));

    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    let image = req.file;
    
    if(!image) {
        return res.status(422).send(JSON.stringify('Attachede file is not an image'));
    }
    
    let imageUrl = image ? image.path : '';

    account = new Account({
        email_address: req.body.email_address,
        password: hashedPassword,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        profile_picture: imageUrl,
        contact_number: req.body.contact_number,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        city: req.body.city,
        ifAdmin: req.body.account_status
    });

    await account.save();

    res.json(account);
});

function validateAccount(data) {
    const schema = Joi.object({
        email_address: Joi.string().email().lowercase().required()
            .messages({
                "string.base": `"email address" field should be a valid email`,
                "any.required": `"email address" is required and not allowed to be empty`
            }),
        password: Joi.string().required().empty()
            .messages({
                "string.base": `"password" field should be a text or string type data`,
                "any.required": `"password" field is required and not allowed to be empty`
            }),
        first_name: Joi.string().required().empty().min(2).max(20)
            .messages({
                "string.base": `"first name" should be a type of text or string`,
                "string.empty": `"first name" cannot be an empty field`,
                "any.required": `"first name" field is required`,
                "string.min": `"first name" should have a minimum length of 2 characters`,
                "string.max": `"first name" should have a maximum length of 20 characters`,
            }),
        last_name: Joi.string().required().empty().min(2).max(20)
            .messages({
                "string.base": `"last name" should be a type of text or string`,
                "string.empty": `"last name" cannot be an empty field`,
                "any.required": `"last name" field is required`,
                "string.min": `"last name" should have a minimum length of 2 characters`,
                "string.max": `"last name" should have a maximum length of 20 characters`,
            }),
        contact_number: Joi.string().required().empty()
            .messages({
                "string.base": `"contact number" field should be the type of string`,
                "string.empty": `"contact number" field must not be empty`
            }),
        address_line_1: Joi.string().required().empty()
            .messages({
                "string.base": `"address line 1" field should be the type of string`,
                "string.empty": `"address line 1" field is required and must not be empty`
            }),
        address_line_2: Joi.string().allow(''),
        city: Joi.string().required().empty(),
        account_status: Joi.boolean().required()
    })
    return schema.validate(data);
}

module.exports = router;