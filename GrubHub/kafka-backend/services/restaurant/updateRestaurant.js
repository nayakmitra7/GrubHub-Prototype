let restaurant = require("../../model/restaurantModel");

function handle_request(req, callback) {
  const update = { ownerFirstName: req.firstName, ownerLastName: req.lastName, ownerEmail: req.email, ownerPhone: req.phone, restaurantName: req.restaurantName, restaurantAddress: req.restaurantAddress, restaurantCuisine: req.restaurantCuisine, restaurantZipCode: req.restaurantZipCode };
  restaurant.findOneAndUpdate({ _id: req.restaurantId }, update, { new: true }).exec((err, user) => {
    if (err||user==null) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  });
}

exports.handle_request = handle_request;
