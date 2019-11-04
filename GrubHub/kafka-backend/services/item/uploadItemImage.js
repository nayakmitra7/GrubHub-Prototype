let item = require("../../model/itemModel");

function handle_request(req, callback) {
  let data = { itemImage: "uploads/itemImage" + req.originalname + ".jpeg" }
  item.findOneAndUpdate({ _id: req.originalname }, data).exec((err, user) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, user);
      }
    });
}

exports.handle_request = handle_request;
