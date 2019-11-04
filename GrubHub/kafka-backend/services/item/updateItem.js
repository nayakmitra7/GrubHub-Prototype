let item = require("../../model/itemModel");

function handle_request(req, callback) {
  let data = { ItemName: req.itemName, sectionId: req.itemSection, ItemPrice: req.itemPrice, ItemDesc: req.itemDesc }
  item.findOneAndUpdate({ _id: req.itemId}, data).exec((err, item) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, item);
      }
    });
}

exports.handle_request = handle_request;
