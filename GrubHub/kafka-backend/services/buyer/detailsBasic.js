let buyer = require("../../model/buyerModel");

function handle_request(msg, callback) {
  buyer.findOne({ buyerEmail: msg }).exec((err, post) => {
      if (err||post==null) {
        callback(err, null);
      } else {
        callback(null, post);
      }
    });
}

exports.handle_request = handle_request;
