const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const ObjectId = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Orders = require('../models/orders');

router.get('/orders', ensureAuthenticated, (req, res, next) => {
    if (!req.isAuthenticated()) { 
        res.redirect('/');
    }
    const _id = ObjectId(req.session.passport.user);

    Acct.getById(_id, function(results){
      
      Orders.getAll(function(orderList){

        var active = orderList.filter(obj => {
          return obj.status !== "Delivered";
        })

        var past = orderList.filter(obj => {
          return obj.status === "Delivered";
        })

        res.render('manageorder', {title: 'Admin - Orders',
          fname: results.fname,
          profilepic: results.profilepic,
          activeorders: active,
          pastorders: past
        });
      })
    })
})

router.post('/changeStatus', (req, res) =>
{
  let id = ObjectId(req.body.orderNo);
  console.log("ID ", id)
  let stat = req.body.newStatus;

  Orders.getItemById(id, function(results){
    console.log(results)
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