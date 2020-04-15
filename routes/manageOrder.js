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
  let id = ObjectId(req.body.orderNo);
  let stat = req.body.newStatus;

  Order.findOne({_id: id}, (err, results) => {
    results.status = stat;
    
    if(stat === "Delivered") 
    {
      var d = new Date();

      var month = d.getMonth()+1;
      var day = d.getDate();

      var output = d.getFullYear() + '/' +
          (month<10 ? '0' : '') + month + '/' +
          (day<10 ? '0' : '') + day;
      
      results.date_of_deliver = output;
    }

    results.save();
  })

  res.send(id);

});

module.exports = router;