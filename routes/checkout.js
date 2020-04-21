const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Orders = require('../models/orders');

var shoppingCartItems = null;

class orderItem {
    constructor(productno, price, quantity, itemPrice) {
        this.productno = productno;
        this.unitprice = price;
        this.quantity = quantity;
        this.itemPrice = itemPrice;
    }
}

router.post('/passCheckout', (req,res,next) => {
    shoppingCartItems = req.body;
    res.send("done")
})

router.get('/checkout', ensureAuthenticated, (req,res) => {
    
    const _id = ObjectID(req.session.passport.user);

    Acct.getById(_id, function(results){
        
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
            profilepic: results.profilepic,
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

    Acct.getById(_id, function(results){
        
        let total_price = 50;
        let order_items = [];
        let buyer = _id;
        let status = "Active";
        let buyername = results.fname + " " + results.lname;

        for (item of shoppingCartItems) {
            total_price += item.itemPrice;
            let orderitem = new orderItem(item.productno, item.price, item.quantity, item.itemPrice);
            order_items.push(orderitem);
        }

        // create new order
        // let order = new Order({
        //     status,
        //     buyer,
        //     buyername,
        //     total_price,
        //     order_items
        // });

        // if(order) console.log('order items successfully added to order');
        // else console.log('error in adding order items to order');

        //console.log(order_items)
        Orders.create(status, buyer, total_price, order_items)

        res.send(status);
        
    })
});

module.exports = router;
