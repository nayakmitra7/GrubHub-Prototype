const jwtSecret = 'mahalasa_narayani';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var pool = require('./Base.js');
const bcrypt = require('bcrypt');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const saltRounds = 10;

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
            pool.query('SELECT buyerPassword,buyerID FROM buyer where buyerEmail ="' + username + '"', function (err, result, fields) {
                if (err) {
                    return done(null, false);
                } else {
                    if (result.length == 0) {
                        var message = [];
                        var errors = { msg: "Unregistered User!" };
                        message.push(errors);
                        return done(message, false);
                    } else {
                        var row = JSON.parse(JSON.stringify(result[0]));
                        bcrypt.compare(password, row.buyerPassword, function (err, result) {
                            if (result) {
                                var user = { username: username, id: row.buyerID }
                                return done(null, user);
                            } else {
                                var message = [];
                                var errors = { msg: " Invalid Password!" };
                                message.push(errors);
                                return done(message, false);
                            }
                        });

                    }
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
            pool.query('SELECT ownerPassword,ownerId FROM owner where ownerEmail ="' + username + '"', function (err, result, fields) {
                if (err) {
                    return done(null, false);
                } else {
                    if (result.length == 0) {
                        var message = [];
                        var errors = { msg: "Unregistered User!" };
                        message.push(errors);
                        return done(message, false);
                    } else {
                        var row = JSON.parse(JSON.stringify(result[0]));
                        bcrypt.compare(password, row.ownerPassword, function (err, result) {
                            if (result) {
                                var user = { username: username, id: row.buyerID }
                                return done(null, user);
                            } else {
                                var message = [];
                                var errors = { msg: " Invalid Password!" };
                                message.push(errors);
                                return done(message, false);
                            }
                        });

                    }
                }
            })

        }
    ));
passport.use('signup',
    new LocalStrategy({
        usernameField: 'firstName',
        passwordField: 'password',
        passReqToCallback : true
    },function (req,firstName, password, done) {
            console.log(req.body);

            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                if (!err) {
                    var query = 'INSERT INTO buyer (buyerFirstName, buyerLastName, buyerPassword,buyerEmail,buyerAddress) VALUES ("' + req.body.firstName + '","' + req.body.lastName + '","' + hash + '","' + req.body.email + '","' + req.body.address + '");'
                    console.log(query);
                    pool.query(query, function (err, result, fields) {
                        if (err) {
                            done(null,false)
                        } else {
                           done(null,true)
                        }
                    })
                } else {
                    console.log("error")
                    done(null,false)
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