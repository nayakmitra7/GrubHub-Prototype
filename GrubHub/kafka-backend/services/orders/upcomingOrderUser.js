let order = require("../../model/orderModel");

function handle_request(msg, callback) {
  order.find({$and:[{ buyerId: msg },{ $and: [{ orderStatus: { $ne: "Delivered" } }, { orderStatus: { $ne: "Cancelled" } }] }]}).sort({$natural:-1}).exec((err, result) => {
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
