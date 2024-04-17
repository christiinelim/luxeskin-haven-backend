const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

const app = express();

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(
    express.urlencoded({
        'extended': false
    })
);

// app.use(session({
//     store: new FileStore(),
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true
// }))

// app.use(flash());

// app.use(function(req,res, next){
//     res.locals.success_messages = req.flash('success_messages');
    
//     res.locals.error_messages = req.flash('error_messages');
//     next();
// });

// app.use(function(req,res,next){
//     res.locals.user = req.session.user;
//     next();
// })

async function main() {
    const landingRoutes = require('./routes/landing');

    app.use('/', landingRoutes);
}

main();

app.listen(3000, ()=>{
    console.log("server has started");
})