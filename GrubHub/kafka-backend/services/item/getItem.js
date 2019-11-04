let item = require("../../model/itemModel");

function handle_request(req, callback) {
  item.find({ restaurantId: req }).sort({ ItemName: 1 }).exec((err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
}

exports.handle_request = handle_request;
