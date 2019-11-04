let owner = require("../../model/restaurantModel");

function handle_request(msg, callback) {
  owner.findOne({ ownerEmail: msg }).exec((err, result) => {
    if (err||result==null) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
}

exports.handle_request = handle_request;
