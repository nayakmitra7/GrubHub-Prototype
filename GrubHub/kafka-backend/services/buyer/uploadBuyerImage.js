let buyer = require("../../model/buyerModel");

function handle_request(req, callback) {
  let data = { buyerImage: "uploads/profileImage" + req.originalname + ".jpeg" };
    buyer.findOneAndUpdate({ _id: req.originalname }, data).exec((err, user) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  });
}

exports.handle_request = handle_request;
