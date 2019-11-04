let buyer = require("../../model/buyerModel");

function handle_request(msg, callback) {
  buyer.findOne({ buyerEmail: msg }).exec((err, result) => {
      if (err||result==null) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
}

exports.handle_request = handle_request;
