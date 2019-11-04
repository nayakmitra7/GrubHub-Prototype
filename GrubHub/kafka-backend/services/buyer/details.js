let buyer = require("../../model/buyerModel");

function handle_request(msg, callback) {
    buyer.findOne({ _id: msg }).exec((err, buyer) => {
      if (err||buyer==null) {
        callback(err, null);
      } else {
        callback(null, buyer);
      }
    });
}

exports.handle_request = handle_request;
