let order = require("../../model/orderModel");

function handle_request(msg, callback) {
  order.find({ $and: [{ restaurantId: msg }, { orderStatus: "Preparing" }] }).exec((err, result) => {
    if (err) {
      callback(err, null);
    } else if (result == null) {
      callback(null, null);
    } else {
      callback(null, result);
    }
  });
}

exports.handle_request = handle_request;
