var express = require('express');
var router = express.Router();
var app = express();
var pool = require('../config/Base.js');
app.use('/uploads', express.static('uploads'))
var message = [];
let order = require('../model/orderModel');

router.post('/placeOrder', function (req, res, next) {
    const orderStatus= "New";
    const orderDetails= req.body.bag;
    const orderDate= req.body.date;
    const buyerId= req.body.buyerID;
    const buyerAddress= req.body.buyerAddress;
    const buyerFirstName= req.body.buyerFirstName;
    const buyerLastName= req.body.buyerLastName;
    const restaurantId= req.body.restaurantId;
    const restaurantName= req.body.restaurantName;
    const newOrder= new order({
        orderStatus,orderDetails,orderDate,buyerId,buyerAddress,buyerFirstName,buyerLastName,restaurantId,restaurantName,restaurantName
    })
    newOrder.save((err,order)=>{
        if(err){
            next()
        }else{
            res.status(200).send("success");
        }
    })

})
router.get('/orders/(:data)', function (req, res, next) {
    var query = 'select orderId,restaurantId,buyerId,buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order where (orderStatus="Delivered" or orderStatus="Cancelled") and order.restaurantId =' + req.params.data
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
router.get('/new/(:data)', function (req, res, next) {
    order.find({$and:[{ restaurantId: req.params.data },{orderStatus:"New"}]}).exec((err, result) => {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })
})
router.get('/confirmed/(:data)', function (req, res, next) {
    order.find({$and:[{ restaurantId: req.params.data },{orderStatus:"Confirmed"}]}).exec((err, result) => {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })
})
router.get('/preparing/(:data)', function (req, res, next) {
    order.find({$and:[{ restaurantId: req.params.data },{orderStatus:"Preparing"}]}).exec((err, result) => {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })
})
router.get('/ready/(:data)', function (req, res, next) {
    order.find({$and:[{ restaurantId: req.params.data },{orderStatus:"Ready"}]}).exec((err, result) => {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })
})
router.get('/cancelled/(:data)', function (req, res, next) {
    order.find({$and:[{ restaurantId: req.params.data },{orderStatus:"Cancelled"}]}).exec((err, result) => {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })
})
router.post('/cancel',
    function (req, res, next) {
        console.log(req.body.id)
         order.findOneAndUpdate({_id:req.body.id},{orderStatus:"Cancelled"}).exec((err, result) => {
            if (err) {
                next();
            } else if (result == null) {
                next()
            } else {
                res.status(200).send(JSON.stringify(result))
            }
        })

    })
router.post('/statusChange',
    function (req, res, next) {
        order.findOneAndUpdate({_id:req.body.id},{orderStatus:req.body.status}).exec((err, result) => {
            if (err) {
                next();
            } else if (result == null) {
                next()

            } else {
                res.status(200).send(JSON.stringify(result))
            }
        })

    })

router.get('/pastOrders/user/(:data)', function (req, res, next) {
    order.find({ $and: [{ buyerId: req.params.data }, { $or: [{ orderStatus: "Delivered" }, { orderStatus: "Cancelled" }] }] }).exec((err, result) => {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })

})
router.get('/upcomingOrders/user/(:data)', function (req, res, next) {
    order.find({$and:[{ buyerId: req.params.data },{ $and: [{ orderStatus: { $ne: "Delivered" } }, { orderStatus: { $ne: "Cancelled" } }] }]}).exec((err, result) => {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })

})
router.get('/pastOrders/owner/(:data)',function (req, res, next) {
    order.find({ $and: [{ restaurantId: req.params.data },{ orderStatus: "Delivered" }]}).exec((err, result) => {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })

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
