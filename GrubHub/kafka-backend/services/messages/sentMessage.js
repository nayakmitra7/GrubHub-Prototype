let messages = require("../../model/messageModel");

function handle_request(msg, callback) {
  messages
    .find({ senderId: msg })
    .sort({ $natural: -1 })
    .exec((err, result) => {
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
