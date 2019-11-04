let item = require("../../model/itemModel");

function handle_request(req, callback) {
  item.deleteMany({ sectionId: req }).exec((err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
}

exports.handle_request = handle_request;
