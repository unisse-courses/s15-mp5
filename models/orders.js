'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
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
    order_items: [{
        productno: {type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true},
        quantity: {type: Number, required: true},
        unitprice: {type: Number, required: true},
        itemPrice: {type: Number, required: true}
    }]
});

var Orders = mongoose.model('orders', schema);

exports.create = function(status, buyer, total_price, order_items){

    let order = new Orders({
            status,
            buyer,
            total_price,
            order_items
    });

    //console.log(typeof order.buyer);

    order.save()
}

exports.getByBuyer = function(id, next){
    Orders.find({buyer: id})
        .populate('order_items.productno')
        .sort({'date_of_order': 'desc'})
        .limit(3)
        .exec((err, orderList) => {
        if (err) throw err;
        next(orderList);
    }) 
}

exports.getAll = function(next){
    Orders.find({}).populate('buyer').populate('order_items.productno').exec((err, orderList) => {
        if (err) throw err;
        next(orderList);
    });
}

exports.getById = function(id, next){
    Orders.find({buyer: id})
        .populate('order_items.productno')
        .populate('buyer')
        .exec ((err, results) => {
        if (err)  throw err;
        next(results)
    })
}

exports.getItemById = function(_id, next){
    Orders.findOne({_id}, (err, results) => {
        if (err)  throw err;
        next(results)
    })
}
