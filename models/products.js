'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    picture: {
        type: String,
        //required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});


var Prod = mongoose.model('products', schema);

exports.getAll = function(next){
    Prod.find({}, (err, products) => {

        if (err) {
            throw err;
        }

        next(products)
    });
}

exports.create = function(picture, name, price){

    let newProduct = new Prod({picture, name, price});
    newProduct.save();
}

exports.update = function(id, name, price, picture){
    Prod.updateOne({ "_id" : id }, 
    { "$set" : 
        {   "name" : name, 
            "price" : price,
            "picture": picture
        }
    }).then( x => {console.log("Update Success")});
}

exports.updateNoPicture = function(id, name, price){
    Prod.updateOne({ "_id" : id }, 
    { "$set" : 
        {   "name" : name, 
            "price" : price,
        }
    }).then( x => {console.log("Update Success")});
}

exports.delete = function(id){
    Prod.deleteOne({"_id": id}, function(err, result) {
       if (err) throw err;
    })
    console.log("deleteOne done")
}