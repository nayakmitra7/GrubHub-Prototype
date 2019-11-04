let item = require("../../model/itemModel");

function handle_request(req, callback) {
  const ItemName = req.itemName;
  const ItemDesc = req.itemDesc;
  const ItemPrice = req.itemPrice;
  const restaurantId = req.restaurantId;
  const sectionId = req.itemSection;
  const itemImage = null;
  const newItem = new item({
    ItemName,
    ItemDesc,
    ItemPrice,
    restaurantId,
    sectionId,
    itemImage
  });
  newItem.save((err, item) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, item);
    }
  });
}

exports.handle_request = handle_request;
