var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
var app = express();
var message=[];
const address = "http://localhost:"
app.use('/uploads', express.static('uploads'))
const multer = require('multer');
let item = require('../model/itemModel');

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
        const ItemName = req.body.itemName;
        const ItemDesc = req.body.itemDesc;
        const ItemPrice = req.body.itemPrice;  
        const restaurantId = req.body.restaurantId;
        const sectionId = req.body.itemSection;
        const itemImage=null;
        const newItem = new item({
            ItemName,
            ItemDesc,
            ItemPrice,
            restaurantId,
            sectionId,
            itemImage
        });
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            newItem.save((err, item) => {
                if (err) {
                    errors = { msg: "The Item already exits." }
                    message.push(errors);
                    next(message);
                } else {
                    res.status(200).send({itemId:item._id});
                }
            })
        }
    })

router.get('/(:data)', function (req, res, next) {
    
    item.find({restaurantId:req.params.data}).sort({ItemName:1}).exec((err,result)=>{
        if(err){
            next();
        }else if(result==null){
            res.status(200).send("");
        }else{
            var modifiedResult = [];
            JSON.parse(JSON.stringify(result)).forEach(item => {
                if (item.itemImage != null) {
                    item.itemImage = address + "3001/" + item.itemImage;
                    modifiedResult.push(item);
                } else {
                    modifiedResult.push(item);
                }
            });
            res.status(200).end(JSON.stringify(modifiedResult));
        }
    })
    
})
  


router.put('/', [check("itemName", "Item Name is needed.").not().isEmpty(),
check("itemPrice", "Item Price is needed.").not().isEmpty(),
check("itemSection", "Item Section is needed.").not().equals("0")],
    function (req, res, next) {
        var data = { ItemName: req.body.itemName, sectionId: req.body.itemSection,ItemPrice:req.body.itemPrice,ItemDesc:req.body.itemDesc }
        item.findOneAndUpdate({ _id: req.body.itemId }, data).exec((err, user) => {
            if (err) {
                next();
            } else {
                res.status(200).end("Success");
            }
        });
        
    })

router.delete('/(:data)', function (req, res, next) {
    item.findOneAndDelete({ _id: req.params.data}).exec((err, user) => {
        if (err) {
            next();
        } else {
            res.status(200).end("Success");
        }
    });
})
router.post('/image', upload2.single('myImage'), function (req, res, next) {
    var data = { itemImage: "uploads/itemImage" + req.file.originalname + ".jpeg" }
    item.findOneAndUpdate({ _id: req.file.originalname }, data).exec((err, user) => {
        if (err) {
            next();
        } else {
            res.status(200).end("Success");
        }
    });
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
