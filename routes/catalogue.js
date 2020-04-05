const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

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
    console.log(results);
    res.render('catalogue', {title: 'Catalogue', fname: results.fname,
        catalogue: [
            {itemPicture: "kirkland-vitc.png", itemName: "Kirkland Vitamin-C", itemPrice: "200.00"},
            {itemPicture: "kirkland-vitd.png", itemName: "Kirkland Vitamin-D", itemPrice: "300.00"},
            {itemPicture: "kirkland-vite.png", itemName: "Kirkland Vitamin-E", itemPrice: "500.00"},
            {itemPicture: "enervon-vitc.png", itemName: "Enervon Vitamin-C", itemPrice: "150.00"},
            {itemPicture: "biogesic-paracetamol.png", itemName: "Biogesic Paracetamol", itemPrice: "300.00"},
        ]})
    })
})

module.exports = router;
