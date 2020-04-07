const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    profilepic: {
        type: String,
        required: true,
        default: "defaultdp.png"
    },
    email: {
        type: String,
        required: true
    },
    pw1: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    number: {
        type: String
    },
    add1: {
        type: String,
        required: true
    },
    add2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    ifAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Model = mongoose.model('accounts', schema);

module.exports = Model;