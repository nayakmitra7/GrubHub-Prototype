let express = require('express');
let router = express.Router();
var kafka = require('../kafka/client');

router.post('/placeOrder', function (req, res, next) {
    kafka.make_request('postPlaceOrder', req.body, function (err, result) {
        if (err) {
            next()
        } else {
            res.status(200).send("success");
        }
    })

})
router.post('/cancel',
    function (req, res, next) {
        kafka.make_request('postCancelOrder', req.body, function (err, result) {
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
        kafka.make_request('postChangeOrderStatus', req.body, function (err, result) {
            if (err) {
                next();
            } else if (result == null) {
                next()

            } else {
                res.status(200).send(JSON.stringify(result))
            }
        })

    })

router.get('/new/(:data)', function (req, res, next) {
    kafka.make_request('getNewOrderOwner', req.params.data, function (err, result) {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }


    });
})
router.get('/confirmed/(:data)', function (req, res, next) {
    kafka.make_request('getConfirmedOrderOwner', req.params.data, function (err, result) {
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
    kafka.make_request('getPreparingOrderOwner', req.params.data, function (err, result) {
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
    kafka.make_request('getReadyOrderOwner', req.params.data, function (err, result) {
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
    kafka.make_request('getCancelledOrderOwner', req.params.data, function (err, result) {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })
})
router.get('/pastOrders/user/(:data)', function (req, res, next) {
    kafka.make_request('getPastOrderUser', req.params.data, function (err, result) {
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
    kafka.make_request('getUpcomingOrderUser', req.params.data, function (err, result) {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send(JSON.stringify(""))
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })

})
router.get('/pastOrders/owner/(:data)', function (req, res, next) {
    kafka.make_request('getPastOrderOwner', req.params.data, function (err, result) {
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
    let message = [];
    let errors = { msg: "Something went wrong!" }
    message.push(errors);
    res.writeHead(201, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(message));
})
module.exports = router;
