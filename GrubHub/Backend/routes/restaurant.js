let express = require('express');
const { check, validationResult } = require('express-validator');
let router = express.Router();
let app = express();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { address, jwtSecret } = require('../config/constants');
let message = [];
app.use('/uploads', express.static('uploads'))
const multer = require('multer');
var kafka = require('../kafka/client');

let storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        let filename = "ownerImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
let upload3 = multer({ storage: storage3 });

let storage4 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        let filename = "restaurantImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
let upload4 = multer({ storage: storage4 });

router.post('/login', [check("username", "Please fill in the User Name.").not().isEmpty(), check("password", "Please fill in the Password.  ").not().isEmpty()], function (req, res, next) {
    message = validationResult(req).errors;
    if (message.length > 0) {
        next(message);
    } else {
        passport.authenticate('loginOwner', (err, owner, info) => {
            if (err) {
                next(err);
            } else {
                const token = jwt.sign({ userId: owner.id }, jwtSecret, { expiresIn: '1d' });
                res.status(200).send({ message: "Successful Login", tokens: token, owner: owner });
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
                    res.status(200).send({ message: "Successful Login", tokens: token, owner: owner });
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

            kafka.make_request('putUpdateRestaurant', req.body, function (err, user) {
                if (err || user == null) {
                    next();
                } else {
                    let results = JSON.parse(JSON.stringify(user));
                    if (JSON.parse(JSON.stringify(user)).ownerImage != null) {
                        let imageAddress = address + "3001/" + JSON.parse(JSON.stringify(user)).ownerImage;
                        results.ownerImage = imageAddress;
                    }
                    if (JSON.parse(JSON.stringify(user)).restaurantImage != null) {
                        let imageAddress = address + "3001/" + JSON.parse(JSON.stringify(user)).restaurantImage;
                        results.restaurantImage = imageAddress;
                    }
                    res.status(200).end(JSON.stringify(results));

                }
            });
        }
    })
router.get('/detailsBasic/(:data)', function (req, res, next) {
    kafka.make_request('getDetailsBasicRestaurant', req.params.data, function (err, post) {
        if (err || post == null) {
            next();
        }
        else {
            res.status(200).end(JSON.stringify(post));
        }

    })
})
router.get('/details/(:data)', passport.authenticate('jwt'), function (req, res, next) {
    kafka.make_request('getDetailsRestaurant', req.params.data, function (err, post) {
        if (err || post == null) {
            next();
        } else {
            let results = JSON.parse(JSON.stringify(post));
            if (JSON.parse(JSON.stringify(post)).ownerImage != null) {
                let imageAddress = address + "3001/" + JSON.parse(JSON.stringify(post)).ownerImage;
                results.ownerImage = imageAddress;
            }
            if (JSON.parse(JSON.stringify(post)).restaurantImage != null) {
                let imageAddress = address + "3001/" + JSON.parse(JSON.stringify(post)).restaurantImage;
                results.restaurantImage = imageAddress;
            }
            res.status(200).end(JSON.stringify(results));
        }

    })

})
router.post('/OwnerImage', passport.authenticate('jwt'), upload3.single('myImage'), function (req, res, next) {
    kafka.make_request('postOwnerImage', req.file, function (err, post) {
        if (err) {
            next();
        } else {
            res.status(200).end("Success");
        }
    });
});
router.post('/restaurantImage', passport.authenticate('jwt'), upload4.single('myImage'), function (req, res, next) {
    kafka.make_request('postRestaurantImage', req.file, function (err, post) {
        if (err) {
            next();
        } else {
            res.status(200).end("Success");
        }
    });
});

router.get('/searched/(:data)', passport.authenticate('jwt'), function (req, res, next) {
    kafka.make_request('getRestaurantSearched', req.params.data, function (err, result) {
        if (err) {
            next();
        } else {
            res.status(200).end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    });

})
router.use((error, req, res, next) => {
    res.writeHead(201, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(error));
})
router.use((req, res, next) => {
    let message = [];
    let errors = { msg: "Something went wrong!" }
    message.push(errors);
    res.writeHead(201, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(message));
})
module.exports = router;
