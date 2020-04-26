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

const itemupload = multer({storage: itemstrategy, fileFilter: imgfilter}).single('itemImg');

router.get('/products', ensureAuthenticated, (req, res, next) => {

    Prod.getAll(function(results){
        res.render('managecatalogue', {title: 'Admin - Catalogue',
        fname: req.user.fname,
        profilepic: req.user.profilepic,
        products: results
        });   
    });
})


router.post('/products', (req, res, next) => {

    itemupload(req, res, () => {
        //console.log(req.body);
        //console.log(req.file);

        var id = req.body.id;
        var name = req.body.name;
        var price = parseFloat(req.body.price);
        if(req.file != undefined) var picture = req.file.filename;

        // Create 
        if(id == "")
        {
            Prod.create(picture, name, price);
            res.redirect('/admin/products');
        }
        else if (req.file != undefined) // Update with Picture Change
        {
            const _id = ObjectId(id);
            Prod.update(id, name, price, picture);
            res.redirect('/admin/products');
        }
        else // Update with no picture change
        {
            const _id = ObjectId(id);
            Prod.updateNoPicture(id, name, price);
            res.redirect('/admin/products');
        }
    })
    
});

router.post('/deleteProduct', (req, res, next) => {
    itemupload(req, res, () => {
        console.log("delete request received")
        var id = req.body.id;
        var _id = ObjectId(id);
        Prod.delete(_id);
        res.sendStatus(204);
    })
});


module.exports = router;