'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
        default: null
    },
    total_price: {
        type: Number,
        required: true,
        default: 0
    },
    order_items: {
        type: Array,
        required: true
    }
});

const Model = mongoose.model('orders', schema);

module.exports = Model;