'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    picture: {
        type: String,
        //required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});


const Model = mongoose.model('products', schema);

module.exports = Model;