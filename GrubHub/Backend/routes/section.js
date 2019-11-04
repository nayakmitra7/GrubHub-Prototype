const { check, validationResult } = require('express-validator');
let message = [];
let express = require('express');
let router = express.Router();
var kafka = require('../kafka/client');

router.post('/',
    [check("sectionName", "Section Name is needed.").not().isEmpty()]
    , function (req, res, next) {
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            kafka.make_request('postSection', req.body, function (err, result) {
                if (err) {
                    errors = { msg: "The Section already exits." }
                    message.push(errors);
                    next(message);
                } else {
                    res.status(200).send("Success");
                }
            })

        }
    })
router.get('/(:data)', function (req, res, next) {
    kafka.make_request('getSection', req.params.data, function (err, result) {
        if (err) {
            next();
        } else {
            res.status(200).end(JSON.stringify(result));
        }

    })
})


router.put('/', [check("menuSectionName", "Section Name is needed.").not().isEmpty()],
    function (req, res, next) {
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            kafka.make_request('putSection', req.body, function (err, result) {
                if (err) {
                    next();
                } else if(result==null){
                    next();
                }else {
                    res.status(200).end("Success");
                }
            });
        }
    })

let promiseDelete = (req) => {
    return new Promise((resolve, reject) => {
        kafka.make_request('deleteItemMany', req.params.data , function (err, result) {
            if (err) {
                reject()
            } else {
                resolve()
            }

        })
    })
}
router.delete('/(:data)', function (req, res, next) {
    promiseDelete(req).then(() => {
        kafka.make_request('deleteSection', req.params.data , function (err, result) {
            if (err) {
                next()
            } else {
                res.status(200).send("Success")
            }

        })

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
