const { jwtSecret, saltRounds } = require('./constants');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
var kafka = require('../kafka/client');


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
            kafka.make_request('postBuyerLogin', username, function (err, post) {
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
            kafka.make_request('postRestaurantLogin', username, function (err, post) {
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
               req.body.hash=hash;
                kafka.make_request('postBuyerSignup', req.body, function (err, buyer) {
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
                req.body.hash=hash;
                kafka.make_request('postOwnerSignup', req.body, function (err, owner) {
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