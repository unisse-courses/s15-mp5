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
    buyername: {
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

var Orders = mongoose.model('orders', schema);

exports.create = function(status, buyer, buyername, total_price, order_items){

    let order = new Orders({
            status,
            buyer,
            buyername,
            total_price,
            order_items
    });

    order.save()
}

exports.getByBuyer = function(email, next){
    Orders.find({buyer: email}).sort({'date_of_order': 'desc'}).limit(3).exec((err, orderList) => {
        if (err) throw err;
        next(orderList);
    }) 
}

exports.getAll = function(next){
    Orders.find({}, (err, orderList) => {
        if (err) throw err;
        next(orderList);
    });
}

exports.getById = function(id, next){
    Orders.findOne({"_id":id}, (err, results) => {
        if (err)  throw err;
        next(results)
    })
}
