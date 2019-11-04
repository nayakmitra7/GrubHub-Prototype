let section = require("../../model/sectionModel");

function handle_request(req, callback) {
  let data = { menuSectionName: req.menuSectionName, menuSectionDesc: req.menuSectionDesc }
  section.findOneAndUpdate({ _id: req.menuSectionId }, data).exec((err, section) => {
      if (err||section==null) {
        callback(err, null);
      } else {
        callback(null, section);
      }
    });
}

exports.handle_request = handle_request;
