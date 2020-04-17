const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Order = require('../models/orders');

/* var shoppingCartItems = null;

class orderItem {
    constructor(productno, name, price, quantity, computedPrice, itemImg) {
        this.productno = productno;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.computedPrice = computedPrice;
        this.itemImg = itemImg;
    }
} */

router.get('/myorders', ensureAuthenticated, (req,res) => {
    
    const _id = ObjectID(req.session.passport.user);
  
    Acct.findOne({ _id }, (err, results) => {
        if (err) {
            throw err;
        }

        Order.find({ buyer: results.email }, (err, results) => {
            var active = results.filter(obj => {
                return obj.status !== "Delivered";
            })

            var past = results.filter(obj => {
                return obj.status === "Delivered";
            })

            res.render('myorders', {title: 'My Orders',
                activeorders: active,
                pastorders: past,
                fname: req.user.fname,
                profilepic: req.user.profilepic,
            })
        })

    })
})

module.exports = router;
