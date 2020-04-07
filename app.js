// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const hbs = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
require('./config/passport')(passport);

// Statics
app.use(express.static('assets'));
app.use(express.static(__dirname + '/public'));
app.enable('strict routing');
app.all('/admin', function(req, res) { res.redirect('/admin/'); });
app.use('/admin/',express.static(__dirname+'/public'));
app.use('/admin/',express.static('assets'));


// MongoDB
const URL = "mongodb+srv://LouisD69:baloney1@pharmago-5nuy4.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));


// Handlebars
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

app.engine('hbs', exphbs({
    extname: 'hbs',
    //defaultview: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    handlebars: allowInsecurePrototypeAccess(hbs)
}))

app.set('view engine', 'hbs')

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    next();
});

// Routes
app.use('/', require('./routes/login'));
app.use('/', require('./routes/register'));
app.use('/', require('./routes/catalogue'));
app.use('/', require('./routes/profile'));
app.use('/', require('./routes/checkout'));
app.use('/admin', require('./routes/manageOrder'));
app.use('/admin', require('./routes/catalogue'));
app.use('/admin', require('./routes/manageCatalogue'));

// Port
const port = 3000;

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});