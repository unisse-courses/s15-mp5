'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email_address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String
    },
    contact_number: {
        type: String
    },
    address_line_1: {
        type: String,
        required: true
    },
    address_line_2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    ifAdmin: {
        type: Boolean,
        required: true
    }
});

const Model = mongoose.model('accounts', schema);

module.exports = Model;