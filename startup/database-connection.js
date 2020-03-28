'use strict';

const mongoose = require('mongoose');

const connectDB = mongoose.connect('mongodb://localhost/pharmago', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(() => console.log('MonggoDB Connected'))
.catch(err => console.log(err));

module.exports = connectDB;