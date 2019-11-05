let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const {uri,addressAllowed} = require('../config/constants');
let cors = require('cors');
require('../config/passport.js');
require('dotenv').config();
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true,poolSize:4});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('Mongo DB Connected successfully!');
})
app.use(passport.initialize());
app.set('view engine', 'ejs');
app.use(cors({ origin: addressAllowed, credentials: true }));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', addressAllowed);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
app.use('/users', require('./users.js'));
app.use('/owner', require('./restaurant.js'));
app.use('/order',passport.authenticate('jwt'), require('./order.js'));
app.use('/message', passport.authenticate('jwt'),require('./message.js'));
app.use('/item', passport.authenticate('jwt'),require('./item.js'));
app.use('/section', passport.authenticate('jwt'),require('./section.js'));
app.listen(3001);
console.log("Server Listening on port 3001");
