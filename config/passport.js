const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Acct = require('../models/accounts');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email', passwordField: 'pw1'}, (email, password, done) => {
            Acct.passport(email)
            .then( acct => {
                if(!acct){
                    return done(null, false, {message: "Email is not registered"});
                }
                
                bcrypt.compare(password, acct.pw1, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        return done(null, acct);
                    }else{
                        return done(null, false, {message: "Password incorrect"});
                    }
                })
            })
            .catch(err => console.log(err));
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        var doneParam = done;
        Acct.passportId(id, doneParam);
        
    });

}
