const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csurf = require('csurf');
require('dotenv').config();

const app = express();

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.json());
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(
    express.urlencoded({
        'extended': false
    })
);

async function main() {
    const adminRoutes = require('./routes/admin');
    const sellerRoutes = require('./routes/seller');

    app.use('/admin', adminRoutes);
    app.use('/api/seller', sellerRoutes)
}

main();

app.listen(3000, ()=>{
    console.log("server has started");
})