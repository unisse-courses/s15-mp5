const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const ObjectId = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Order = require('../models/orders');

router.get('/orders', ensureAuthenticated, (req, res, next) => {
    if (!req.isAuthenticated()) { 
        res.redirect('/');
    }
    const _id = ObjectId(req.session.passport.user);
    Acct.findOne({ _id }, (err, results) => {
        if (err) {
          throw err;
    }

    Order.find({}, (err, result) => {
      if (err) throw err;
      //console.log(result);

      res.render('manageOrder', {title: 'Admin - Orders',
        fname: results.fname,
        profilepic: req.user.profilepic,
        orders: result,
        });
    });
  });
})

router.post('/changeStatus', (req, res) =>
{
  let id = "jolo@cansana.net"; //ObjectId(req.body.orderNo);
  let newStatus = req.body.newStatus;
  console.log(id)

  Order.updateOne({ "buyer" : id }, 
  { 
    "$set" : {   "status" : newStatus   }
  })
  
  res.send("ok");

});

module.exports = router;