'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    order_item_no: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    order_no: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    },
    product_no: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    computed_price: {
        type: Number,
        required: true
    }
});

const Model = mongoose.model('order_items', schema);

module.exports = Model;