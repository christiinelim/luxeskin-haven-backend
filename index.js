const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const cors = require('cors');
// const session = require('express-session');
// const flash = require('connect-flash');
// const FileStore = require('session-file-store')(session);
// const cookieParser = require('cookie-parser');
// const csurf = require('csurf');
require('dotenv').config();

const app = express();
// const { csrfErrorHandler } = require('./middlewares');

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(cors()); // MUST BE BEFORE SESSIONS
// app.use(cookieParser());
app.use(express.json());
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(
    express.urlencoded({
        'extended': false
    })
);

// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);
// app.use(csrfErrorHandler);

main = async () => {
    const adminRoutes = require('./routes/admin');
    // const csrfRoutes = require('./routes/csrf');

    const api = {
        sellerRoutes: require('./routes/api/seller'),
        productRoutes: require('./routes/api/product'),
        discountRoutes: require('./routes/api/discount'),
        cloudinaryRoutes: require('./routes/api/cloudinary'),
        userRoutes: require('./routes/api/user'),
        cartRoutes: require('./routes/api/cart')
    }

    app.use('/admin', adminRoutes);
    // app.use('/api/csrf', csrfRoutes);
    app.use('/api/seller', api.sellerRoutes);
    app.use('/api/product', api.productRoutes);
    app.use('/api/discount', api.discountRoutes);
    app.use('/api/cloudinary', api.cloudinaryRoutes);
    app.use('/api/user', api.userRoutes);
    app.use('/api/cart', api.cartRoutes);
}

main();

app.listen(3000, () => {
    console.log("server has started");
})