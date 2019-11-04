let item = require("../../model/itemModel");

function handle_request(req, callback) {
  item.findOneAndDelete({ _id: req }).exec((err, item) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, item);
      }
    });
}

exports.handle_request = handle_request;
