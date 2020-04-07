const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Order = require('../models/orders');

var shoppingCartItems = null;

class orderItem {
    constructor(productno, quantity, computedPrice) {
        this.productno = productno;
        this.quantity = quantity;
        this.computedPrice = computedPrice;
    }
}

router.post('/passCheckout', (req,res,next) => {
    shoppingCartItems = req.body;
    res.send("done")
})

router.get('/checkout', ensureAuthenticated, (req,res) => {
    
    const _id = ObjectID(req.session.passport.user);
  
    Acct.findOne({ _id }, (err, results) => {
        if (err) {
            throw err;
            }
    
        var total = 0;
        for(item of shoppingCartItems)
        {
            total += item.itemPrice;
        }
        total += 50;

        res.render('checkout', {title: 'Checkout',
            order: shoppingCartItems,
            totalPrice: total.toFixed(2),
            fname: results.fname,
            lname: results.lname,
            email: results.email,
            contactNumber: results.number,
            addressLine1: results.add1,
            addressLine2: results.add2
        })
    })
})

router.post('/checkout', async (req, res) => {

    const _id = ObjectID(req.session.passport.user);

    Acct.findOne({ _id }, (err, results) => {
        let total_price = 50;
        let order_items = [];
        let buyer = results.email;
        let status = "Active";

        for (item of shoppingCartItems) {
            total_price += item.itemPrice;
            let orderitem = new orderItem(item.productno, item.quantity, item.itemPrice);
            order_items.push(orderitem);
        }

        // create new order
        let order = new Order({
            status,
            buyer,
            total_price,
            order_items
        });

        if(order) console.log('order items successfully added to order');
        else console.log('error in adding order items to order');

        console.log(order)
        order.save();

        res.send(order);
    })

});

module.exports = router;
