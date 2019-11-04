let order = require("../../model/orderModel");

function handle_request(req, callback) {
  
  const orderStatus = "New";
  const orderDetails = req.bag;
  const orderDate = req.date;
  const buyerId = req.buyerID;
  const buyerAddress = req.buyerAddress;
  const buyerFirstName = req.buyerFirstName;
  const buyerLastName = req.buyerLastName;
  const restaurantId = req.restaurantId;
  const restaurantName = req.restaurantName;

  const newOrder = new order({
      orderStatus, orderDetails, orderDate, buyerId, buyerAddress, buyerFirstName, buyerLastName, restaurantId, restaurantName, restaurantName
  })

  newOrder.save((err, order) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, order);
    }
})

}

exports.handle_request = handle_request;
