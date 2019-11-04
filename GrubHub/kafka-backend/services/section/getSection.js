let section = require("../../model/sectionModel");

function handle_request(msg, callback) {
  section.find({ restaurantId: msg }).exec((err, result) => {
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
