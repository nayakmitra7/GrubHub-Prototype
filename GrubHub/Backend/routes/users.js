const jwtSecret = 'mahalasa_narayani';
var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
var app = express();
var pool = require('../config/Base.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const saltRounds = 10;
const address = "http://localhost:"
app.use('/uploads', express.static('uploads'))
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var filename = "profileImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
var upload = multer({ storage: storage });
var message = [];

router.post('/login', [check("username", "Please fill in the User Name.").not().isEmpty(), check("password", "Please fill in the Password.  ").not().isEmpty()],
    function (req, res, next) {
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            passport.authenticate('login', (err, user, info) => {
                if (err) {
                    next(err);
                } else {
                    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1d' });
                    res.status(200).send({ message: "Successful Login", tokens: token });
                }
            })(req, res, next);
        }


    });

router.post('/signup',
    [check("firstName", "First Name is needed.").not().isEmpty(),
    check("lastName", "Last Name is needed.").not().isEmpty(),
    check("password", "Password length needs to be 8 or more.").isLength({ min: 8 }),
    check("email", "Wrong E-Mail format.").isEmail(),
    check("address", "Address is needed.").not().isEmpty()
    ], function (req, res, next) {
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            passport.authenticate('signup', (err, validity) => {
                if (!validity) {
                    next(err);
                } else {
                    var query = 'Select max(buyerID) as val from sys.buyer';
                    pool.query(query, function (err, result, fields) {
                        if (err) {
                            next();
                        } else {
                           
                            const token = jwt.sign({ userId: JSON.stringify(JSON.parse(JSON.stringify(result[0])).val) }, jwtSecret, { expiresIn: '1d' });
                            res.status(200).send({ message: "Successful Login", tokens: token });
                
                        }
                    })
                    
                }
            })(req, res, next);

        }
    });
router.get('/detailsBasic/(:data)', function (req, res, next) {
    var query = 'Select buyerFirstName,buyerID,buyerAddress from buyer where buyerEmail="' + req.params.data + '"'
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
router.get('/details/(:data)', function (req, res, next) {
    passport.authenticate('jwt', (err, validity) => {
        if (!validity) {
            res.status(401).send({ message: "Expired session . Logging out" });
        } else {
            var query = 'Select buyerFirstName,buyerLastName,buyerEmail,buyerPhone,buyerImage,buyerID,buyerAddress,buyerImage from buyer where buyerEmail="' + req.params.data + '"'
            pool.query(query, function (err, result, fields) {
                if (err) {
                    next();
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    var results = JSON.parse(JSON.stringify(result[0]));
                    if (JSON.parse(JSON.stringify(result[0])).buyerImage != null) {
                        var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(result[0])).buyerImage;
                        results.buyerImage = imageAddress;
                    }
                    res.end(JSON.stringify(results));

                }
            })
        }
    })(req, res, next);

})

router.post('/update', [check("firstName", "First Name is needed.").not().isEmpty(),
check("lastName", "Last Name is needed.").not().isEmpty(),
check("phone", "Invalid phone number.").isLength({ min: 10, max: 10 }),
check("email", "Wrong E-Mail format.").isEmail(), check("address", "Address is needed.").not().isEmpty()],
    function (req, res, next) {

        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {

            passport.authenticate('jwt', (err, validity) => {
                if (!validity) {
                    res.status(401).send({ message: "Expired session . Logging out" });
                } else {
                    var query = 'update buyer set buyerFirstName="' + req.body.firstName + '",buyerLastName="' + req.body.lastName + '",buyerEmail ="' + req.body.email + '",buyerPhone="' + req.body.phone + '",buyerAddress="' + req.body.address + '"  where buyerID="' + req.body.ID + '"'
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
            })(req, res, next);



        }
    })

router.post('/upload/photo', upload.single('myImage'), function (req, res, next) {
    passport.authenticate('jwt', (err, validity) => {
        if (!validity) {
            res.status(401).send({ message: "Expired session . Logging out" });
        } else {
            var data = "uploads/profileImage" + req.file.originalname + ".jpeg"
            var query = 'update buyer set buyerImage="' + data + '"  where buyerID="' + req.file.originalname + '"'
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
    })(req, res, next);

});
router.get('/pastOrders/(:data)', function (req, res, next) {
    passport.authenticate('jwt', (err, validity) => {
        if (!validity) {
            res.status(401).send({ message: "Expired session . Logging out" });
        } else {
            var query = 'Select restaurantName,buyerAddress,orderStatus,orderDetails,orderDate,orderId from sys.order,sys.restaurant where (order.orderStatus ="Delivered" or order.orderStatus="Cancelled" )and order.restaurantId=restaurant.restaurantId and buyerId=' + req.params.data
            pool.query(query, function (err, result, fields) {
                if (err) {
                    next();
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
                }
            })
        }
    })(req, res, next);
})
router.get('/upcomingOrders/(:data)', function (req, res, next) {
    passport.authenticate('jwt', (err, validity) => {
        if (!validity) {
            res.status(401).send({ message: "Expired session . Logging out" });
        } else {
            var query = 'Select restaurantName,buyerAddress,orderStatus,orderDetails,orderDate,orderId from sys.order,sys.restaurant where (order.orderStatus !="Delivered" and order.orderStatus!="Cancelled" )and order.restaurantId=restaurant.restaurantId and buyerId=' + req.params.data
            pool.query(query, function (err, result, fields) {
                if (err) {
                    next();
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
                }
            })
        }
    })(req, res, next);


})
router.post('/order', function (req, res, next) {
    passport.authenticate('jwt', (err, validity) => {
        if (!validity) {
            res.status(401).send({ message: "Expired session . Logging out" });
        } else {
            var query = "Insert INTO sys.order (restaurantId,buyerId,buyerAddress,orderStatus,orderDetails,orderDate) values ('" + req.body.restaurantId + "','" + req.body.buyerID + "','" + req.body.buyerAddress + "','" + "New" + "','" + req.body.bag + "','" + req.body.date + "')"
            pool.query(query, function (err, result, fields) {
                if (err) {
                    next();
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });

                    res.end();
                }
            })
        }
    })(req, res, next);
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

