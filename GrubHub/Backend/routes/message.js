let express = require('express');
const { check, validationResult } = require('express-validator');
let router = express.Router();
let messages = require('../model/messageModel');



router.post('/',
    [check("message", "Message is needed.").not().isEmpty()]
    , function (req, res, next) {
        const senderFirstName = req.body.senderFirstName;
        const senderLastName = req.body.senderLastName;
        const receiverFirstName = req.body.receiverFirstName;
        const receiverLastName = req.body.receiverLastName;
        const messageBody = req.body.message;
        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;
        const orderDate = req.body.orderDate;
        const messageDate = req.body.messageDate;
        const newMessage = new messages({
            senderFirstName, senderLastName, receiverFirstName, receiverLastName, messageBody, senderId, receiverId, orderDate,messageDate
        });
       let message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            newMessage.save((err, item) => {
                if (err) {
                  next();
                } else {
                    res.status(200).send("Success");
                }
            })
        }
    })

router.get('/received/(:data)', function (req, res, next) {
    messages.find({ receiverId: req.params.data }).sort({$natural:-1}).exec((err, result) => {
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
    messages.find({ senderId: req.params.data }).sort({$natural:-1}).exec((err, result) => {
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
