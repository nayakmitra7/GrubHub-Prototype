let order = require("../../model/orderModel");

function handle_request(req, callback) {
  order.findOneAndUpdate({_id:req.id},{orderStatus:"Cancelled"}).exec((err, result) => {
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
