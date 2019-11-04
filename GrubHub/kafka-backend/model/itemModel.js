const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    ItemName: { type: String, required: true },
    ItemPrice: { type: String, required: true },
    ItemDesc: { type: String },
    itemImage: { type: String },
    sectionId: { type: String, required: true },
    restaurantId: { type: String, required: true }

});
itemSchema.index({ ItemName: 1, ItemPrice: 1,ItemDesc: 1, sectionId: 1,restaurantId: 1}, { unique: true });

const Item = mongoose.model('Item', itemSchema);

module.exports=Item;