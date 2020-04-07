const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require("mongoose");

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts')

router.get('/catalogue', ensureAuthenticated, (req,res) => {
    
    const _id = ObjectID(req.session.passport.user);
  
    Acct.findOne({ _id }, (err, results) => {
        if (err) {
            throw err;
            }
    
        if(results.ifAdmin)
        {
            return res.redirect('/admin/orders')
        }
        //console.log(results);
        mongoose.model('products').find({}, (err, products) => {
            res.render('catalogue', 
            {
                title: 'Pharmago',
                fname: results.fname,
                catalogue: products
            })
        });
    })
})

module.exports = router;
