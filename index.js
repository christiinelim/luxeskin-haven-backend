const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csurf = require('csurf');
require('dotenv').config();

const app = express();

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(cors());
app.use('/api/cartout/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json());
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(
    express.urlencoded({
        'extended': false
    })
);

app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat', // TO CHANGE
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

const csurfInstance = csurf();

app.use((req, res, next) => {
    if (req.url.slice(0, 5) == '/api/') {
        return next();
    } 
    csurfInstance(req, res, next);
})

app.use((req, res, next) => {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

app.use((err, req, res, next) => {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash("error_messages", "The form has expired, please try again");
        res.redirect('back');
    } else {
        next();
    }
})

main = async () => {
    const adminRoutes = require('./routes/admin');

    const api = {
        sellerRoutes: require('./routes/api/seller'),
        productRoutes: require('./routes/api/product'),
        discountRoutes: require('./routes/api/discount'),
        userRoutes: require('./routes/api/user'),
        cartRoutes: require('./routes/api/cart'),
        cartoutRoutes: require('./routes/api/cartout'),
        orderRoutes: require('./routes/api/order')
    }

    app.use('/', adminRoutes);

    app.use('/api/seller', api.sellerRoutes);
    app.use('/api/product', api.productRoutes);
    app.use('/api/discount', api.discountRoutes);
    app.use('/api/user', api.userRoutes);
    app.use('/api/cart', api.cartRoutes);
    app.use('/api/cartout', api.cartoutRoutes);
    app.use('/api/order', api.orderRoutes);
}

main();

app.listen(3000, () => {
    console.log("server has started");
})