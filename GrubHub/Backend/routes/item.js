var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
var app = express();
var pool = require('../config/Base.js');
var message=[];
const address = "http://localhost:"
app.use('/uploads', express.static('uploads'))
const multer = require('multer');

var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var filename = "itemImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
var upload2 = multer({ storage: storage2 });

router.post('/',
    [check("itemName", "Item Name is needed.").not().isEmpty(),
    check("itemPrice", "Item Price is needed.").not().isEmpty(),
    check("itemSection", "Item Section is needed.").not().isEmpty()]
    , function (req, res, next) {

        var query = 'Insert into menuItems (ItemName,ItemPrice,ItemDesc,SectionId,restaurantId) values ("' + req.body.itemName + '","' + req.body.itemPrice + '","' + req.body.itemDesc + '","' + req.body.itemSection + '","' + req.body.restaurantId + '")'
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            pool.query(query, function (err, result, fields) {
                if (err) {
                    
                    errors = { msg: "Either the item already exits or something went wrong" }
                    message.push(errors);
                    next(message);
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end("Success");
                }
            })
        }
    })

router.get('/(:data)', function (req, res, next) {
    var query = 'Select ItemName,SectionId,ItemPrice,ItemDesc,ItemId,itemImage from menuItems where restaurantId="' + req.params.data + '"'
    pool.query(query, function (err, result, fields) {
        if (err) {
            next();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            var modifiedResult = [];
            JSON.parse(JSON.stringify(result)).forEach(item => {
                if (item.itemImage != null) {
                    item.itemImage = address + "3001/" + item.itemImage;
                    modifiedResult.push(item);
                } else {
                    modifiedResult.push(item);
                }
            });
            res.end(JSON.stringify(JSON.parse(JSON.stringify(modifiedResult))));
        }
    })
})
router.put('/', [check("itemName", "Item Name is needed.").not().isEmpty(),
check("itemPrice", "Item Price is needed.").not().isEmpty(),
check("itemSection", "Item Section is needed.").not().equals("0")],
    function (req, res, next) {
        var query = 'update menuItems set ItemName="' + req.body.itemName + '",SectionId="' + req.body.itemSection + '",ItemPrice ="' + req.body.itemPrice + '",ItemDesc="' + req.body.itemDesc + '"  where ItemId="' + req.body.itemId + '"'
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

router.delete('/(:data)', function (req, res, next) {
    var query = 'Delete from menuItems where ItemId =' + req.params.data
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
})
router.post('/image', upload2.single('myImage'), function (req, res, next) {
    var data = "uploads/itemImage" + req.file.originalname + ".jpeg"
    var query = 'update menuItems set itemImage="' + data + '"  where itemId="' + req.file.originalname + '"'
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
router.get('/maxItemId/(:data)', function (req, res, next) {
    var query = 'Select max(ItemId) as val from sys.menuItems where restaurantId =' + req.params.data
    pool.query(query, function (err, result, fields) {
        if (err) {
            next();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result[0])).val))
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
