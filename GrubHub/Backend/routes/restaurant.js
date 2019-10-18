var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
var app = express();
var pool = require('../config/Base.js');

const address = "http://localhost:"
app.use('/uploads', express.static('uploads'))
const multer = require('multer');
var message=[];

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
router.get('/details/(:data)', function (req, res, next) {
    var query = 'Select restaurantName,restaurantCuisine,restaurantAddress,restaurantZipCode,restaurantImage from restaurant where restaurantId="' + req.params.data + '"'
    pool.query(query, function (err, result, fields) {
        if (err) {
            next();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            var results=JSON.parse(JSON.stringify(result[0]));
            if(JSON.parse(JSON.stringify(result[0])).restaurantImage != null) {
                var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(result[0])).restaurantImage;
                results.restaurantImage = imageAddress
            } 
            res.end(JSON.stringify(results));
        }
    })
    
})
router.post('/image', upload4.single('myImage'), function (req, res, next) {
    var data = "uploads/restaurantImage" + req.file.originalname + ".jpeg"
    var query = 'update restaurant set restaurantImage="' + data + '"  where restaurantId="' + req.file.originalname + '"'
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
    var query = 'Select restaurantImage from restaurant where restaurantId="' + req.params.data + '"'
    pool.query(query, function (err, result, fields) {
        if (err) {
            next();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            if (JSON.parse(JSON.stringify(result[0])).restaurantImage != null) {
                var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(result[0])).restaurantImage;
                var image = { "restaurantImage": imageAddress }
                res.end(JSON.stringify(image));
            } else {
                res.end(JSON.stringify(result));

            }

        }
    })

})
router.post('/update', function (req, res, next) {
    var query = 'update restaurant set restaurantName="' + req.body.restaurantName + '",restaurantCuisine="' + req.body.restaurantCuisine + '",restaurantAddress ="' + req.body.restaurantAddress + '",restaurantZipCode="' + req.body.restaurantZipCode + '"  where restaurantId="' + req.body.restaurantId + '"'
     message = validationResult(req).errors;
    if (message.length > 0) {
        next();
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
router.get('/searched/(:data)', function (req, res, next) {
    var query = 'select restaurantId,restaurantName,restaurantCuisine,restaurantAddress,restaurantImage from restaurant where restaurantId in (SELECT restaurantId FROM menuItems where ItemName like "%' + req.params.data + '%")'
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
