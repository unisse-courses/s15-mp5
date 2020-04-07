const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const app = express();

require('./startup/database-connection');
require('./startup/dependencies')(app);
require('./startup/routes')(app);

const Order = require('./models').orders;
const OrderItem = require('./models').order_items;


const port = process.env.PORT || 9090;

app.use(express.static('assets'))

app.engine('hbs', hbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: 'hbs',
    defaultview: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}))

app.set('view engine', 'hbs')

app.set('port', process.env.PORT || 9090)

app.use(express.static(__dirname + '/public'))

var shoppingCartItems = null;

app.get('/', (req,res) => {
    res.render('login', {title: 'Login', layout: 'landing'})
})

app.get('/register', (req,res) => {
    res.render('register', {title: 'Register', layout: 'landing'})
})

app.get('/catalogue', (req,res) => {
    mongoose.model('products').find({}, (err, products) => {
        res.render('catalogue', {title: 'Pharmago',
        catalogue: products,
        })
    });
})

app.post('/checkout', async (req,res,next) => {
    let ids = [];
    let total_price = 0;
    let order_items = req.body.order_items;
    let buyer = req.body.buyer;
    let status = "Pending";
    let date_of_order = new Date();

    for (var i = 0; i < order_items.length; i++) {
        ids.push(order_items[i]._id);
        total_price += order_items[i].computed_price
    }

    // create new order
    let order = await Order.create({
        status,
        buyer,
        date_of_order,
        total_price
    });

    // update order_items with the order created
    let updateOrderItems = await OrderItem.updateMany(
        { _id: { $in: ids } },
        { order_no: order._id, status: 1 }
    );

    if(updateOrderItems) console.log('order items successfully added to order');
    else console.log('error in adding order items to order');

    res.send(order);
})

app.get('/checkout', (req, res) =>
{
    var total = 0;
    for(item of shoppingCartItems)
    {
        total += item.itemPrice;
    }
    total += 50;

    res.render('checkout', {title: 'Checkout',
        order: shoppingCartItems,
        totalPrice: total.toFixed(2),
        fullName: "John Doe",
        email: "john.doe@gmail.com",
        contactNumber: "09175666242",
        addressLine1: "123 Main St.",
        addressLine2: "Manila City, Metro Manila"
    })
});

app.get('/profile', (req,res) => {
    res.render('profile', {title: 'Profile',
    fullName: "John Doe",
    email: "john.doe@gmail.com",
    contactNumber: "09175666242",
    addressLine1: "123 Main St.",
    addressLine2: "Manila City, Metro Manila"
    })
})

app.get('/manageorder', (req,res) => {
    res.render('manageorder', {
        title: 'Admin - Manage Orders',
        orders: [
            {
                orderno: "12345",
                status: "Active",
                buyeremail: "john.doe@gmail.com",
                dateoforder: "02/01/2020",
                dateofdeliver: "02/07/2020",
                totalprice: "1700.00",
                orderitems: [
                    {
                        name: "Kirkland Vitamin-C",
                        price: "200.00",
                        quantity: "2",
                        total: ""
                    },
                    {
                        name: "Kirkland Vitamin-D",
                        price: "300.00",
                        quantity: "1",
                        total: ""
                    },
                    {
                        name: "Kirkland Vitamin-E",
                        price: "500.00",
                        quantity: "2",
                        total: ""
                    }
                ]
            }
        ]
    })
})

app.get('/managecatalogue', (req,res) => {
    res.render('managecatalogue', {
        title: 'Admin - Manage Catalogue',
        products: [
            {
                picture: 'kirkland-vitd.png',
                name: 'Kirkland Vitamin-D',
                price: '300.00'
            }
        ]
        
    })
})

app.listen(port, () => console.log(`Listening to port ${port}... Press Ctrl+C to exit.`));

