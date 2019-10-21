const jwtSecret = 'mahalasa_narayani';
var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
var app = express();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const saltRounds = 10;
const address = "http://localhost:"

let buyer = require('../model/buyerModel');
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
            passport.authenticate('signup', (err, validity, buyer) => {
                if (!validity) {
                    next(err);
                } else {
                    const token = jwt.sign({ userId: buyer._id }, jwtSecret, { expiresIn: '1d' });
                    res.status(200).send({ message: "Successful Login", tokens: token, id:buyer._id});
                }
            })(req, res, next);
        }
    });
router.get('/detailsBasic/(:data)', function (req, res, next) {
    buyer.findOne({ buyerEmail: req.params.data }).exec((err, post) => {
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
router.get('/details/(:data)', function (req, res, next) {
    passport.authenticate('jwt', (err, validity) => {
        if (!validity) {
            res.status(401).send({ message: "Expired session . Logging out" });
        } else {
            buyer.findOne({ _id: req.params.data }).exec((err, post) => {
                if (err) {
                    next();
                } else if (post == null) {
                    next();
                } else {
                    var results = JSON.parse(JSON.stringify(post));
                    if (JSON.parse(JSON.stringify(post)).buyerImage != null) {
                        var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(post)).buyerImage;
                        results.buyerImage = imageAddress;
                    }
                    res.status(200).end(JSON.stringify(results));
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
                    var update = { buyerFirstName: req.body.firstName, buyerLastName: req.body.lastName, buyerEmail: req.body.email, buyerPhone: req.body.phone, buyerAddress: req.body.address }
                    buyer.findOneAndUpdate({ _id: req.body.ID }, update).exec((err, user) => {
                        if (err) {
                            next();
                        } else {
                            res.status(200).end("Success");

                        }
                    });
                }
            })(req, res, next);
        }
    })

router.post('/upload/photo', upload.single('myImage'), function (req, res, next) {
    passport.authenticate('jwt', (err, validity) => {
        if (!validity) {
            res.status(401).send({ message: "Expired session . Logging out" });
        } else {
            var data = { buyerImage: "uploads/profileImage" + req.file.originalname + ".jpeg" }
            buyer.findOneAndUpdate({ _id: req.file.originalname }, data).exec((err, user) => {
                if (err) {
                    next();
                } else {
                    res.status(200).end("Success");
                }
            });
        }
    })(req, res, next);

});


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

