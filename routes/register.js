const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { forwardAuthenticated } = require('../config/auth');

const Acct = require('../models/accounts')

router.get('/register', forwardAuthenticated, (req,res) => {
    res.render('register', {title: 'Register', layout: 'landing'})
})

router.post('/register', (req,res) => {

    const { fname, lname, email, number, pw1, pw2, add1, add2, city, ifAdmin } = req.body;

    Acct.findOne({ email: email})
    .then( acct => {
        if(acct){
            console.log("user exists with that email");
        }
        else{
            const newUser = new Acct({
                fname,
                lname,
                email,
                number,
                pw1,
                add1,
                add2,
                city,
                ifAdmin
            });

            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.pw1, salt, (err, hash) => {
                    if(err) throw err;
                    // Hashed password
                    newUser.pw1 = hash;
                    newUser.save()
                    .then(acct => {
                        res.redirect('/');
                    })
                    .catch(err => console.log(err));
                }))
        }
    })
});

module.exports = router;