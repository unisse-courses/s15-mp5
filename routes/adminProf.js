const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');

const multer = require('multer');

const dpstrategy = multer.diskStorage({
  destination: function (req, file, cb)
  {
      cb(null, './assets/profilepictures/')
  },
  filename: function (req, file, cb)
  {
      cb(null, file.originalname)
  }
})

const fileFilter = function (req, file, cb)
{
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb (null, true);
  else cb (null, false);
}

const dpupload = multer({storage: dpstrategy, fileFilter: fileFilter});

router.get('/profile', ensureAuthenticated, (req, res, next) => {

    const _id = ObjectID(req.session.passport.user);
    
    Acct.getById(_id, function(results){
        
      res.render('adminprofile', {title: 'Profile',
        fname: results.fname,
        profilepic: req.user.profilepic,
        lname: results.lname,
        email: results.email,
        number: results.number,
        add1: results.add1,
        add2: results.add2,
        city: results.city,
        profilepic: results.profilepic
      })
  })
})

router.post('/profilepicture', dpupload.single('profilePic') ,function(req, res, next) {

  const _id = ObjectID(req.session.passport.user);
  const picture = req.file.filename;
  Acct.updatePicture(_id, picture);
  res.redirect('/admin/profile');
});

router.post('/changepassword' ,function(req, res, next) {

  const _id = ObjectID(req.session.passport.user);
  
  if(req.body.ps1 == req.body.ps2)
  {
    bcrypt.genSalt(10, (err, salt) => 
      bcrypt.hash(req.body.ps1, salt, (err, hash) => {
        if(err) throw err;
        Acct.updatePassword(_id, hash)
        res.redirect('/admin/profile');
    }))
  }
});

module.exports = router;