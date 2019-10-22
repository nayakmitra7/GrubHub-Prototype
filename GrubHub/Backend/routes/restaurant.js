var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
var app = express();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSecret = 'mahalasa_narayani';
const address = "http://localhost:"
var message = [];
let restaurant = require('../model/restaurantModel');
let item = require('../model/itemModel');
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

var storage4 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var filename = "restaurantImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
var upload4 = multer({ storage: storage4 });

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
            passport.authenticate('signupOwner', (err, validity, owner) => {
                if (!validity) {
                    next(err);
                } else {
                    const token = jwt.sign({ userId: owner._id }, jwtSecret, { expiresIn: '1d' });
                    res.status(200).send({ message: "Successful Login", tokens: token, ID: owner._id });
                }
            })(req, res, next);
        }
    });
router.post('/update', [check("firstName", "First Name is needed.").not().isEmpty(),
check("lastName", "Last Name is needed.").not().isEmpty(),
check("phone", "Invalid phone number.").isLength({ min: 10, max: 10 }),
check("email", "Wrong E-Mail format.").isEmail(),
check("restaurantAddress", "Restaurant Address is needed.").not().isEmpty(),
check("restaurantName", "Restaurant Name is needed.").not().isEmpty(),
check("restaurantCuisine", "Restaurant Cuisine must have one cuisine.").isAlpha(),
check("restaurantZipCode", "Restaurant ZipCode is Invalid.").isLength({ min: 5, max: 5 })], passport.authenticate('jwt'),
    function (req, res, next) {
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            const update = { ownerFirstName: req.body.firstName, ownerLastName: req.body.lastName, ownerEmail: req.body.email, ownerPhone: req.body.phone, restaurantName: req.body.restaurantName, restaurantAddress: req.body.restaurantAddress, restaurantCuisine: req.body.restaurantCuisine, restaurantZipCode: req.body.restaurantZipCode };
            restaurant.findOneAndUpdate({ _id: req.body.restaurantId }, update).exec((err, user) => {
                if (err) {
                    next();
                } else if (user == null) {
                    next();
                } else {
                    res.status(200).send("Success");

                }
            });
        }
    })
router.get('/detailsBasic/(:data)', function (req, res, next) {
    restaurant.findOne({ ownerEmail: req.params.data }).exec((err, post) => {
        if (err) {
            next();
        }
        else if (post == null) {
            next();
        } else {
            res.status(200).end(JSON.stringify(post));
        }

    })
})
router.get('/details/(:data)', passport.authenticate('jwt'), function (req, res, next) {
    restaurant.findOne({ _id: req.params.data }).exec((err, post) => {
        if (err) {
            next();
        } else if (post == null) {
            next();
        } else {
            var results = JSON.parse(JSON.stringify(post));
            if (JSON.parse(JSON.stringify(post)).ownerImage != null) {
                var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(post)).ownerImage;
                results.ownerImage = imageAddress;
            }
            if (JSON.parse(JSON.stringify(post)).restaurantImage != null) {
                var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(post)).restaurantImage;
                results.restaurantImage = imageAddress;
            }
            res.status(200).end(JSON.stringify(results));
        }

    })

})
router.post('/OwnerImage', passport.authenticate('jwt'), upload3.single('myImage'), function (req, res, next) {
    var data = { ownerImage: "uploads/ownerImage" + req.file.originalname + ".jpeg" }
    restaurant.findOneAndUpdate({ _id: req.file.originalname }, data).exec((err, user) => {
        if (err) {
            next();
        } else {
            res.status(200).end("Success");
        }
    });
});
router.post('/restaurantImage', passport.authenticate('jwt'), upload4.single('myImage'), function (req, res, next) {
    var data = { restaurantImage: "uploads/restaurantImage" + req.file.originalname + ".jpeg" }
    restaurant.findOneAndUpdate({ _id: req.file.originalname }, data).exec((err, user) => {
        if (err) {
            next();
        } else {
            res.status(200).end("Success");
        }
    });
});

router.get('/searched/(:data)', function (req, res, next) {
    item.find({ "ItemName": { $regex: '.*' + req.params.data + '.*', $options: 'i' } }).distinct('restaurantId').exec((err, post) => {
        if (err) {
            reject();
        } else {
           restaurant.find().where('_id').in(post).exec((err,result)=>{
            var modifiedResult = [];
            JSON.parse(JSON.stringify(result)).forEach(restaurant => {
                if (restaurant.restaurantImage != null) {
                    restaurant.restaurantImage = address + "3001/" + restaurant.restaurantImage;
                    modifiedResult.push(restaurant);
                } else {
                    modifiedResult.push(restaurant);
                }
            });
            res.status(200).end(JSON.stringify(JSON.parse(JSON.stringify(modifiedResult))));
           })

        }
    })

    /*var query = 'select restaurantId,restaurantName,restaurantCuisine,restaurantAddress,restaurantImage from restaurant where restaurantId in (SELECT restaurantId FROM menuItems where ItemName like "%' + req.params.data + '%")'
    pool.query(query, function (err, result, fields) {
        if (err) {
            next();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            var modifiedResult = [];
            JSON.parse(JSON.stringify(result)).forEach(restaurant => {
                if (restaurant.restaurantImage != null) {
                    restaurant.restaurantImage = address + "3001/" + restaurant.restaurantImage;
                    modifiedResult.push(restaurant);
                } else {
                    modifiedResult.push(restaurant);
                }
            });
            res.end(JSON.stringify(JSON.parse(JSON.stringify(modifiedResult))));
        }
    })*/
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
