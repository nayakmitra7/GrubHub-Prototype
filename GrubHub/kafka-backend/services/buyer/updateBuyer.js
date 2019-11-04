let buyer = require("../../model/buyerModel");

function handle_request(req, callback) {
  let update = { buyerFirstName: req.firstName, buyerLastName: req.lastName, buyerEmail: req.email, buyerPhone: req.phone, buyerAddress: req.address }
  buyer.findOneAndUpdate({ _id: req.ID }, update, { new: true }).exec((err, user) => {
    if (err||user==null) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  });
}

exports.handle_request = handle_request;
