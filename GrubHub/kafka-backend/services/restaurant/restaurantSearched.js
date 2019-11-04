let restaurant = require("../../model/restaurantModel");
let item = require("../../model/itemModel");
const { address } = require('../../../Backend/config/constants');
function handle_request(req, callback) {
  item.find({ "ItemName": { $regex: '.*' + req + '.*', $options: 'i' } }).distinct('restaurantId').exec((err, post) => {
    if (err) {
      callback(err, null)
    } else {
      restaurant.find().where('_id').in(post).exec((err, result) => {
        let modifiedResult = [];

        JSON.parse(JSON.stringify(result)).forEach(restaurant => {
          if (restaurant.restaurantImage != null) {
            restaurant.restaurantImage = address + "3001/" + restaurant.restaurantImage;
            modifiedResult.push(restaurant);
          } else {
            modifiedResult.push(restaurant);
          }
        });
        callback(null, modifiedResult);

      })
    }
  })
}

exports.handle_request = handle_request;
