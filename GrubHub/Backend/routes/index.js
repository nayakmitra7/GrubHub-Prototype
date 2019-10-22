//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const address = "http://localhost:"
var cors = require('cors');
require('../config/passport.js');
require('dotenv').config();
const uri= 'mongodb+srv://root:root@cluster0-skd7n.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true,poolSize:4});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('Mongo');
})
app.use(passport.initialize());
app.set('view engine', 'ejs');
app.use(cors({ origin: address + '3000', credentials: true }));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', address + '3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use('/users', require('./users.js'));
app.use('/owner', require('./restaurant.js'));
app.use('/order', passport.authenticate('jwt'), require('./order.js'));
app.use('/message', passport.authenticate('jwt'),require('./message.js'));
app.use('/item', passport.authenticate('jwt'),require('./item.js'));
app.use('/section', passport.authenticate('jwt'),require('./section.js'));





app.listen(3001);
console.log("Server Listening on port 3001");
