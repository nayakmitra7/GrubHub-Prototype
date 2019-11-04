let section = require("../../model/sectionModel");

function handle_request(msg, callback) {
  section.deleteOne({ _id: msg}).exec((err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
}

exports.handle_request = handle_request;
