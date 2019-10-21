const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sectionSchema = new Schema({
    menuSectionName: { type: String, required: true },
    menuSectionDesc: { type: String},
    restaurantId: { type: String, required: true }
});
sectionSchema.index({ menuSectionName: 1, restaurantId: 1}, { unique: true });

const Section = mongoose.model('Section', sectionSchema);

module.exports=Section;