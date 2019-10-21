const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const buyerSchema = new Schema({
    buyerFirstName: { type: String, required: true },
    buyerLastName: { type: String, required: true },
    buyerEmail: { type: String, required: true,unique:true },
    buyerPassword: { type: String, required: true },
    buyerPhone: { type: String },
    buyerImage: { type: String },
    buyerAddress: { type: String, required: true }

});
buyerSchema.plugin(uniqueValidator)
const buyer = mongoose.model('Buyer', buyerSchema);

module.exports=buyer;