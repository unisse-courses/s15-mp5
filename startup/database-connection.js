
'use strict';

const mongoose = require('mongoose');

const connectDB = mongoose.connect('mongodb://localhost/pharmago', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(() => console.log('MonggoDB Connected via Mongoose'))
.catch(err => console.log(err));

module.exports = connectDB;

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://LouisD69:baloney1@pharmago-5nuy4.gcp.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { 
//     useNewUrlParser: true,
//     useUnifiedTopology: true  
// });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   perform actions on the collection object
//   client.close();
// });