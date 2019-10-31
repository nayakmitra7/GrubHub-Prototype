let express = require('express');
const { check, validationResult } = require('express-validator');
let router = express.Router();
let message = [];
let section = require('../model/sectionModel');
let item = require('../model/itemModel');


router.post('/',
    [check("sectionName", "Section Name is needed.").not().isEmpty()]
    , function (req, res, next) {
        const menuSectionName = req.body.sectionName;
        const menuSectionDesc = req.body.sectionDesc;
        const restaurantId = req.body.restaurantId;
        const newSection = new section({
            menuSectionName,
            menuSectionDesc,
            restaurantId
        });
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            newSection.save((err, sect) => {
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
//.sort({menuSectionName:1})
router.get('/(:data)', function (req, res, next) {
    section.find({ restaurantId: req.params.data }).exec((err, result) => {
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
            let data = { menuSectionName: req.body.menuSectionName, menuSectionDesc: req.body.menuSectionDesc }
            section.findOneAndUpdate({ _id: req.body.menuSectionId }, data).exec((err, user) => {
                if (err) {
                    next();
                } else {
                    res.status(200).end("Success");
                }
            });
        }
    })

let promiseDelete = (req) => {
    return new Promise((resolve, reject) => {
        item.deleteMany({ sectionId: req.params.data }).exec((err, result) => {
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
        section.deleteOne({ _id: req.params.data }).exec((err, result) => {
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
