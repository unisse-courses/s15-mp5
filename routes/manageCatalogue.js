const express = require('express');
const router = express.Router();
var ObjectId = require('mongodb').ObjectID;

const Prod = require('../models/products');
const { ensureAuthenticated } = require('../config/auth');

const multer = require('multer');

const itemstrategy = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, './assets/itempictures/')
    },
    filename: function (req, file, cb)
    {
        cb(null, file.originalname)
    }
});

const imgfilter = function (req, file, cb)
{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb (null, true);
    else cb (null, false);
}

const itemupload = multer({storage: itemstrategy, fileFilter: imgfilter});

router.get('/products', ensureAuthenticated, (req, res, next) => {

    Prod.find( {}, (err, results) => {
        if (err) {
          throw err;
        }
    
    //console.log(results)

    res.render('manageCatalogue', {title: 'Admin - Catalogue',
            fname: req.user.fname,
            profilepic: req.user.profilepic,
            products: results
        }); 
    });
})


router.post('/products', itemupload.single('itemImg'), (req, res, next) => {

    var id = req.body.id;
    var name = req.body.name;
    var price = parseFloat(req.body.price);
    var picture = req.file.filename;
    //console.log(req.file);

    // Create 
    if(id == "")
    {
        const newProduct = new Prod({picture, name, price});
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
                "price" : price,
                "picture": picture
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