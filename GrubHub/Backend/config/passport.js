const jwtSecret = 'mahalasa_narayani';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const saltRounds = 10;

let buyer = require('../model/buyerModel');
let owner = require('../model/restaurantModel');


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use('login',
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        function (username, password, done) {
            buyer.findOne({ buyerEmail: username }).exec((err, post) => {
                if (err) {
                    return done(null, false);
                }
                else if (post == null) {
                    let message = [];
                    let errors = { msg: " Unregistered User!" };
                    message.push(errors);
                    return done(message, false);
                } else {
                    bcrypt.compare(password, post.buyerPassword, function (err, result) {
    
                        if (result) {
                            let user = { username: username, id: post._id }
                            return done(null, user);
                        } else {
                            let message = [];
                            let errors = { msg: " Invalid Password!" };
                            message.push(errors);
                            return done(message, false);
                        }
                    });
                }
            })

        }
    ));
passport.use('loginOwner',
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        function (username, password, done) {
            owner.findOne({ ownerEmail: username }).exec((err, post) => {
                if (err) {
                    return done(null, false);
                }
                else if (post == null) {
                    let message = [];
                    let errors = { msg: "Unregistered User!" };
                    message.push(errors);
                    return done(message, false);
                } else {
                    bcrypt.compare(password, post.ownerPassword, function (err, result) {
    
                        if (result) {
                            let user = { username: username, id: post._id }
                            return done(null, user);
                        } else {
                            let message = [];
                            let errors = { msg: " Invalid Password!" };
                            message.push(errors);
                            return done(message, false);
                        }
                    });
                }
            })

        }
    ));
passport.use('signup',
    new LocalStrategy({
        usernameField: 'firstName',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, firstName, password, done) {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (!err) {
                const buyerFirstName = req.body.firstName;
                const buyerLastName = req.body.lastName;
                const buyerEmail = req.body.email;
                const buyerPhone = "";
                const buyerImage = null;
                const buyerAddress = req.body.address;
                const newBuyer = new buyer({
                    buyerFirstName,
                    buyerLastName,
                    buyerEmail,
                    buyerPassword: hash,
                    buyerPhone,
                    buyerImage,
                    buyerAddress
                });
                newBuyer.save((err, buyer) => {
                    if (err) {
                        let message = [];
                        let errors = { msg: "You already have an account!" };
                        message.push(errors);
                        done(message, false, null);
                    } else if (buyer == null) {
                        done(null, false, null);
                    } else {
                        done(null, true, buyer);
                    }
                })
            } else {
                done(null, false)
            }
        });

    }
));
passport.use('signupOwner',
    new LocalStrategy({
        usernameField: 'firstName',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, firstName, password, done) {        
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (!err) {
                const ownerFirstName = req.body.firstName;
                const ownerLastName = req.body.lastName;
                const ownerEmail = req.body.email;
                const ownerPassword =hash;
                const ownerImage = null;
                const ownerPhone = req.body.phone;
                const restaurantName=req.body.restaurant;
                const restaurantCuisine="";
                const restaurantImage=null;
                const restaurantAddress="";
                const restaurantZipCode=req.body.zipcode;
                const newOwner = new owner({
                    ownerFirstName,
                    ownerLastName,
                    ownerEmail,
                    ownerPassword,
                    ownerImage,
                    ownerPhone,
                    restaurantName,
                    restaurantCuisine,
                    restaurantImage,
                    restaurantAddress,
                    restaurantZipCode
                });
                newOwner.save((err, owner) => {
                    if (err) {
                        let message = [];
                        let errors = { msg: "You already have an account!" };
                        message.push(errors);
                        done(message, false, null);
                    } else if (owner == null) {
                        done(null, false, null);
                    } else {
                        done(null, true, owner);
                    }
                })
            } else {
                done(null, false)
            }
        });

    }
));

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtSecret
}

passport.use('jwt', new JWTstrategy(opts, (jwt_paylod, done) => {
    try {
        done(null, true);
    } catch (err) {
        done(null, false)
    }
}));