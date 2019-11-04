let section = require("../../model/sectionModel");

function handle_request(req, callback) {
  const menuSectionName = req.sectionName;
  const menuSectionDesc = req.sectionDesc;
  const restaurantId = req.restaurantId;
  const newSection = new section({
      menuSectionName,
      menuSectionDesc,
      restaurantId
  });
  newSection.save((err, sect) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, sect);
    }
  });
}

exports.handle_request = handle_request;
