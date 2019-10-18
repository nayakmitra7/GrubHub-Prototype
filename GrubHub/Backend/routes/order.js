var express = require('express');
var router = express.Router();
var app = express();
var pool = require('../config/Base.js');
app.use('/uploads', express.static('uploads'))
var message = [];

router.get('/orders/(:data)', function (req, res, next) {
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where (orderStatus="Delivered" or orderStatus="Cancelled") and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="New" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
router.get('/confirmed/(:data)', function (req, res, next) {
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="Confirmed" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
router.get('/preparing/(:data)', function (req, res, next) {
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="Preparing" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
router.get('/ready/(:data)', function (req, res, next) {
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="Ready" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
router.get('/cancelled/(:data)', function (req, res, next) {
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="Cancelled" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
router.post('/cancel',
    function (req, res, next) {
        var query = 'update sys.order set orderStatus="Cancelled" where orderId=' + req.body.id
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

    })
router.post('/statusChange',
    function (req, res, next) {
        var query = 'update sys.order set orderStatus="' + req.body.status + '" where orderId=' + req.body.id
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
