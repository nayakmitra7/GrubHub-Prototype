const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    ownerFirstName: { type: String, required: true },
    ownerLastName: { type: String, required: true },
    ownerEmail: { type: String, required: true,unique:true },
    ownerPassword: { type: String, required: true },
    ownerImage: { type: String },
    ownerPhone: { type: String, required: true },
    restaurantName: { type: String, required: true },
    restaurantCuisine: { type: String},
    restaurantImage: { type: String},
    restaurantAddress: { type: String },
    restaurantZipCode: { type: String, required: true }

});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
RestaurantSchema.plugin(uniqueValidator)
module.exports=Restaurant;