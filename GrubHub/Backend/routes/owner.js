var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
var app = express();
var pool = require('../config/Base.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSecret = 'mahalasa_narayani';

const bcrypt = require('bcrypt');
const saltRounds = 10;
const address = "http://localhost:"
var message = [];

app.use('/uploads', express.static('uploads'))
const multer = require('multer');
var storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var filename = "ownerImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
var upload3 = multer({ storage: storage3 });

router.post('/login', [check("username", "Please fill in the User Name.").not().isEmpty(), check("password", "Please fill in the Password.  ").not().isEmpty()], function (req, res, next) {
    message = validationResult(req).errors;
    if (message.length > 0) {
        next(message);
    } else {
        passport.authenticate('loginOwner', (err, user, info) => {
            if (err) {
                next(err);
            } else {
                const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1d' });
                res.status(200).send({ message: "Successful Login", tokens: token });
            }
        })(req, res, next);
    }
});
var doInsertion = (req) => {
    return new Promise((resolve, reject) => {
        var query1 = 'INSERT INTO restaurant (restaurantName, restaurantZipCode) VALUES ("' + req.body.restaurant + '","' + req.body.zipcode + '");'
        var query2 = 'select max(restaurantId) as val from restaurant';
        pool.query(query1, function (err, result, fields) {
            if (err) {
                return reject();
            } else {
                pool.query(query2, function (err, result, fields) {
                    if (err) {
                        return reject();
                    } else {
                        var restId = JSON.parse(JSON.stringify(result[0])).val;
                        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                            if (!err) {
                                var query3 = 'INSERT INTO owner (ownerFirstName, ownerLastName,ownerEmail,ownerPhone,restaurantId,ownerPassword) VALUES ("' + req.body.firstName + '","' + req.body.lastName + '","' + req.body.email + '","' + req.body.phone + '","' + restId + '","' + hash + '");'
                                pool.query(query3, function (err, result, fields) {
                                    if (err) {
                                        var query4 = 'delete from restaurant where restaurantId =' + restId;
                                        pool.query(query4, function (err, result, fields) {
                                            return reject();

                                        })

                                        return reject();
                                    } else {

                                        return resolve();
                                    }
                                })
                            } else {
                                reject();
                            }
                        })


                    }
                })
            }

        })
    })

}
router.post('/signUp',
    [check("firstName", "First Name is needed.").not().isEmpty(),
    check("lastName", "Last Name is needed.").not().isEmpty(),
    check("phone", "Invalid phone number.").isLength({ min: 10, max: 10 }),
    check("email", "Wrong E-Mail format.").isEmail(),
    check("password", "Password length needs to be 8 or more.").isLength({ min: 8 }),
    check("restaurant", "Restaurant Name is needed.").not().isEmpty(),
    check("zipcode", "Restaurant ZipCode is Invalid.").isLength({ min: 5, max: 5 })
    ], function (req, res, next) {
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            doInsertion(req).then(() => {
                res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end("Success");
            }).catch(() => {
                next();
            })
        }
    });
router.post('/update', [check("firstName", "First Name is needed.").not().isEmpty(),
check("lastName", "Last Name is needed.").not().isEmpty(),
check("phone", "Invalid phone number.").isLength({ min: 10, max: 10 }),
check("email", "Wrong E-Mail format.").isEmail(),
check("restaurantAddress", "Restaurant Address is needed.").not().isEmpty(),
check("restaurantName", "Restaurant Name is needed.").not().isEmpty(),
check("restaurantZipCode", "Restaurant ZipCode is Invalid.").isLength({ min: 5, max: 5 })], passport.authenticate('jwt'),
    function (req, res, next) {
        var query = 'update owner set ownerFirstName="' + req.body.firstName + '",ownerLastName="' + req.body.lastName + '",ownerEmail ="' + req.body.email + '",ownerPhone="' + req.body.phone + '"  where ownerId="' + req.body.ownerId + '"'
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            pool.query(query, function (err, result, fields) {
                if (err) {
                    next();
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end("Success");
                }

            })
        }
    })
router.get('/detailsBasic/(:data)', function (req, res, next) {
    var query = 'Select ownerFirstName,owner.restaurantId,restaurantName,ownerId from sys.owner,sys.restaurant where owner.restaurantId=restaurant.restaurantId and ownerEmail= "' + req.params.data + '"'
    pool.query(query, function (err, result, fields) {
        if (err) {
            next();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(result[0]));


        }
    })
})
router.get('/details/(:data)', passport.authenticate('jwt'), function (req, res, next) {
    var query = 'Select ownerId,ownerFirstName,ownerLastName,ownerImage,ownerEmail,ownerPhone,owner.restaurantId,restaurantName from sys.owner,sys.restaurant where owner.restaurantId=restaurant.restaurantId and ownerId= "' + req.params.data + '"'
    pool.query(query, function (err, result, fields) {
        if (err) {
            next();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            var results=JSON.parse(JSON.stringify(result[0]));
            if (JSON.parse(JSON.stringify(result[0])).ownerImage != null) {
                var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(result[0])).ownerImage;
               results.ownerImage=imageAddress;
            } 
            res.end(JSON.stringify(results));
        }
    })
})
router.post('/image', passport.authenticate('jwt'), upload3.single('myImage'), function (req, res, next) {
    var data = "uploads/ownerImage" + req.file.originalname + ".jpeg"
    var query = 'update owner set ownerImage="' + data + '"  where ownerId="' + req.file.originalname + '"'
    pool.query(query, function (err, result, fields) {
        if (err) {
            next();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end("Success");
        }
    })
});
router.get('/image/(:data)', function (req, res, next) {
    var query = 'Select ownerImage from owner where ownerId="' + req.params.data + '"'
    pool.query(query, function (err, result, fields) {
        if (err) {
            next();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            if (JSON.parse(JSON.stringify(result[0])).ownerImage != null) {
                var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(result[0])).ownerImage;
                var image = { "ownerImage": imageAddress }
                res.end(JSON.stringify(image))
            } else {
                res.end(JSON.stringify(result))
            }

        }
    })

})
router.get('/pastOrders/(:data)', passport.authenticate('jwt'),function (req, res, next) {
    var message = [];
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where (orderStatus="Delivered" ) and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
    pool.query(query, function (err, result, fields) {
        if (err) {
            res.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            errors = { msg: "Something went wrong" }
            message.push(errors);
            res.end(JSON.stringify(message));
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
router.use((error, req, res, next) => {
    res.writeHead(201, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(error));
})
router.use((req, res, next) => {
    var message = [];
    var errors = { msg: "Something went wrong!" }
    message.push(errors);
    res.writeHead(201, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(message));
})
module.exports = router;
