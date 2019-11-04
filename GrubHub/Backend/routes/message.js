const { check, validationResult } = require('express-validator');
let express = require('express');
let router = express.Router();
var kafka = require('../kafka/client');

router.post('/',
    [check("message", "Message is needed.").not().isEmpty()]
    , function (req, res, next) {
        let message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            kafka.make_request('postMessage', req.body, function (err, result) {
                if (err) {
                    next();
                } else {
                    res.status(200).send("Success");
                }
            })
        }
    })

router.get('/received/(:data)', function (req, res, next) {
    kafka.make_request('getReceivedMessage', req.params.data, function (err, result) {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send("");
        } else {
            res.status(200).send(JSON.stringify(result))
        }
    })

})
router.get('/sent/(:data)', function (req, res, next) {
    kafka.make_request('getSentMessage', req.params.data, function (err, result) {
        if (err) {
            next();
        } else if (result == null) {
            res.status(200).send("");
        } else {
            res.status(200).send(JSON.stringify(result))
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
    let message = [];
    let errors = { msg: "Something went wrong!" }
    message.push(errors);
    res.writeHead(201, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(message));
})
module.exports = router;
