const express = require('express');
const router = express.Router();
const passport = require('passport');
const {forwardAuthenticated } = require('../config/auth');

// Use Main Layout for Non-admins
router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
});

// Use Admin Layout for Admins
router.all('/admin*', function (req, res, next) {
    req.app.locals.layout = 'admin';
    next(); // pass control to the next handler
});

router.get('/', forwardAuthenticated, (req,res) => {
    res.render('login', {title: 'Login', layout: 'landing'})
})

router.post('/', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/catalogue',
    failureRedirect: '/',
    failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;