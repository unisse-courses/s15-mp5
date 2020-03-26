'use strict';

const express = require('express');
const login = require('../routes/login');
const accounts = require('../routes/accounts');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/login', login);
    app.use('/api/accounts', accounts);
}