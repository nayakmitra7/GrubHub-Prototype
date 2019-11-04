let owner = require("../../model/restaurantModel");

function handle_request(req, callback) {
  
  const ownerFirstName = req.firstName;
  const ownerLastName = req.lastName;
  const ownerEmail = req.email;
  const ownerPassword = req.hash;
  const ownerImage = null;
  const ownerPhone = req.phone;
  const restaurantName = req.restaurant;
  const restaurantCuisine = "";
  const restaurantImage = null;
  const restaurantAddress = "";
  const restaurantZipCode = req.zipcode;
  const newOwner = new owner({
      ownerFirstName,
      ownerLastName,
      ownerEmail,
      ownerPassword,
      ownerImage,
      ownerPhone,
      restaurantName,
      restaurantCuisine,
      restaurantImage,
      restaurantAddress,
      restaurantZipCode
  });

  newOwner.save((err, buyer) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, buyer);
    }
})

}

exports.handle_request = handle_request;
