'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    order_no: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    buyer: {
        type: String,
        ref: 'accounts',
        required: true
    },
    date_of_order: {
        type: Date,
        required: true,
        default: Date.now
    },
    date_of_deliver: {
        type: Date,
        required: true,
        default: Date.now
    },
    total_price: {
        type: Number,
        required: true,
        default: 0
    }
});

const Model = mongoose.model('orders', schema);

module.exports = Model;