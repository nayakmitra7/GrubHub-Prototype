let restaurant = require("../../model/restaurantModel");

function handle_request(msg, callback) {
  restaurant.findOne({ _id: msg}).exec((err, restaurant) => {
      if (err||restaurant==null) {
        callback(err, null);
      } else {
        callback(null, restaurant);
      }
    });
}

exports.handle_request = handle_request;
