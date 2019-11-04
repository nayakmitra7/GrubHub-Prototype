let buyer = require("../../model/buyerModel");

function handle_request(req, callback) {
  
  const buyerFirstName = req.firstName;
  const buyerLastName = req.lastName;
  const buyerEmail = req.email;
  const buyerPhone = "";
  const buyerImage = null;
  const buyerAddress = req.address;
  const buyerPassword = req.hash
  const newBuyer = new buyer({
      buyerFirstName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
      buyerPassword,
      buyerImage,
      buyerAddress
  });

  newBuyer.save((err, buyer) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, buyer);
    }
})

}

exports.handle_request = handle_request;
