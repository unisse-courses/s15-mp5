const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Order = require('../models/orders');
const OrderItem = require('../models/order_items');

var shoppingCartItems = null;

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

    let ids = [];
    let total_price = 0;
    let order_items = req.body.order_items;
    let buyer = req.body.buyer;
    let status = "Pending";
    let date_of_order = new Date();

    for (var i = 0; i < order_items.length; i++) {
        ids.push(order_items[i]._id);
        total_price += order_items[i].computed_price
    }

    // create new order
    let order = await Order.create({
        status,
        buyer,
        date_of_order,
        total_price
    });

    // update order_items with the order created
    let updateOrderItems = await OrderItem.updateMany(
        { _id: { $in: ids } },
        { order_no: order._id, status: 1 }
    );

    if(updateOrderItems) console.log('order items successfully added to order');
    else console.log('error in adding order items to order');

    res.send(order);

});

module.exports = router;
