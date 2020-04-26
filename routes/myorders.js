const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Orders = require('../models/orders');

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

    Acct.getById(_id, function(results){
      
        Orders.getById(_id, function(orderList){
          console.log(orderList)
          var active = orderList.filter(obj => {
            return obj.status !== "Delivered";
          })
  
          var past = orderList.filter(obj => {
            return obj.status === "Delivered";
          })
  
          res.render('myorders', {title: 'Admin - Orders',
            fname: results.fname,
            profilepic: results.profilepic,
            activeorders: active,
            pastorders: past
          });
        })
    })
})

module.exports = router;
