'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');

const Account = require('../models').accounts;

router.post('/', async (req, res, next) => {
    // validate body
    const { error } = validateCredentials(req.body);
    if(error) return res.status(400).send(JSON.stringify(error.details[0].message));

    // check if email exists
    let account = await Account.findOne({ email_address: req.body.email_address });
    if(!account) return res.status(400).send(JSON.stringify('Incorrect email or password entered'));

    // check if password entered matches with the password stored
    const validPassword = await bcrypt.compareSync(req.body.password, account.password);
    if(!validPassword) return res.status(400).send(JSON.stringify('Incorrect email or password entered'));

    //create session
    req.session.isLoggedIn = true;
    req.session.accountId = account._id;

    res.json(account);
});

router.delete('/', async (req, res, next) => {
    req.session.destroy();
    res.send('Logged Out');
});

function validateCredentials(user) {
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
            })
    });
    return schema.validate(user);
}

module.exports = router;