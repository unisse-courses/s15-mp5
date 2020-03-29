const express = require('express');

const app = express();

require('./startup/dependencies')(app);
require('./startup/routes')(app);
require('./startup/database-connection');

const port = process.env.PORT || 9090;
var hbs = require('express-handlebars');

app.use(express.static('assets'))

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultview: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}))

app.set('view engine', 'hbs')

app.set('port', process.env.PORT || 9090)

app.use(express.static(__dirname + '/public'))

app.get('/', (req,res) => {
    res.render('login', {title: 'Login', layout: 'landing'})
})

app.get('/register', (req,res) => {
    res.render('register', {title: 'Register', layout: 'landing'})
})

app.get('/catalogue', (req,res) => {
    res.render('catalogue', {title: 'Pharmago',
    catalogue: [
        {itemPicture: "kirkland-vitc.png", itemName: "Kirkland Vitamin-C", itemPrice: "200.00"},
        {itemPicture: "kirkland-vitd.png", itemName: "Kirkland Vitamin-D", itemPrice: "300.00"},
        {itemPicture: "kirkland-vite.png", itemName: "Kirkland Vitamin-E", itemPrice: "500.00"},
        {itemPicture: "enervon-vitc.png", itemName: "Enervon Vitamin-C", itemPrice: "150.00"},
        {itemPicture: "biogesic-paracetamol.png", itemName: "Biogesic Paracetamol", itemPrice: "300.00"},
    ]})
})

app.get('/checkout', (req,res) => {
    res.render('checkout', {title: 'Checkout',
    order: [
        {itemPicture: "kirkland-vitc.png", itemName: "Kirkland Vitamin-C", itemPrice: "200.00", quantity: "2"},
        {itemPicture: "kirkland-vitd.png", itemName: "Kirkland Vitamin-D", itemPrice: "300.00", quantity: "2"},
        {itemPicture: "kirkland-vite.png", itemName: "Kirkland Vitamin-E", itemPrice: "500.00", quantity: "2"},
    ],
    fullName: "John Doe",
    email: "john.doe@gmail.com",
    contactNumber: "09175666242",
    addressLine1: "123 Main St.",
    addressLine2: "Manila City, Metro Manila"
    })
})

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
    res.render('manageorder', {title: 'Admin - Manage Orders'
    })
})

app.get('/managecatalogue', (req,res) => {
    res.render('managecatalogue', {title: 'Admin - Manage Catalogue'
    })
})

app.listen(port, () => console.log(`Listening to port ${port}... Press Ctrl+C to exit.`));

