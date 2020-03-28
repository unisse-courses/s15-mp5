'use strict';

const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const moment = require('moment');

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/profile-pictures')
    },
    filename: (req, file, callback) => {
        const date = new Date();
        const today = moment(date).format('YYYYMMDDHHmmss');
        callback(null, today + '-' + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

module.exports = function (app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
    app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
}