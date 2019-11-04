let restaurant = require("../../model/restaurantModel");

function handle_request(req, callback) {
  let data = { restaurantImage: "uploads/restaurantImage" + req.originalname + ".jpeg" }
  restaurant.findOneAndUpdate({ _id: req.originalname }, data).exec((err, user) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  });
}

exports.handle_request = handle_request;
