const express = require('express');
const router = express.Router();
var ObjectId = require('mongodb').ObjectID;

const Prod = require('../models/products');
const { ensureAuthenticated } = require('../config/auth');

router.get('/products', ensureAuthenticated, (req, res, next) => {

    Prod.find( {}, (err, results) => {
        if (err) {
          throw err;
        }
    
    //console.log(results)

    res.render('manageCatalogue', {title: 'Admin - Catalogue',
        products: results
        }); 
    });
})


router.post('/products', (req, res, next) => {

    var id = req.body.id;
    var name = req.body.name;
    var price = parseFloat(req.body.price);
    //var pic = req.body.picture
    console.log(id);

    // Create 
    if(id == "")
    {
        const newProduct = new Prod({name, price});
        newProduct.save()
        .then( x => {
            // res.sendStatus(204)
            res.redirect('/admin/products')
        })
    }
    else // Update
    {
        const _id = ObjectId(id);

        Prod.updateOne({ "_id" : _id }, 
        { "$set" : 
            {   "name" : name, 
                "price" : price
            }
        })
        .then( x => {
            res.sendStatus(204)
        })
    }
    
});

router.post('/deleteProduct', (req, res, next) => {

    var id = req.body.id;
    const _id = ObjectId(id);

    Prod.deleteOne({"_id":id})
    .then( x => {
        res.sendStatus(204)
    })

    // Prod.find( {}, (err, results) => {
    //     if (err) {
    //       throw err;
    // }

    // res.render('manageCatalogue', {title: 'Admin - Catalogue',
    //     products: results
    //     }); 
    // });

});


module.exports = router;