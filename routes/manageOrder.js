const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Order = require('../models/orders');

router.get('/orders', ensureAuthenticated, (req, res, next) => {
    if (!req.isAuthenticated()) { 
        res.redirect('/');
    }
    const _id = ObjectID(req.session.passport.user);
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

module.exports = router;