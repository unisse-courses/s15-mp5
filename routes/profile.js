const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts')

router.get('/profile', ensureAuthenticated, (req, res, next) => {

    const _id = ObjectID(req.session.passport.user);
    Acct.findOne({ _id }, (err, results) => {
        if (err) {
          throw err;
      }
  
      res.render('profile', {title: 'Profile',
        fname: results.fname,
        lname: results.lname,
        email: results.email,
        number: results.number,
        add1: results.add1,
        add2: results.add2,
        city: results.city
      })
  });
})

router.post('/profile', function(req, res, next) {

  // const { fname, lname, email, number, add1, add2, city} = req.body;
  number = req.body.number;
  add1 = req.body.add1;
  add2 = req.body.add2;
  city = req.body.city;

  //var id = req.body.id;
  const _id = ObjectID(req.session.passport.user);

  Acct.updateOne({ "_id" : _id }, 
  { "$set" : 
    {"number" : number, 
      "add1" : add1,
      "add2" : add2,
      "city" : city
    }
  })
  .then( x => {
    res.sendStatus(204)
  })
  
});

module.exports = router;