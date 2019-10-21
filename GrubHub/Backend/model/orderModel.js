const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderStatus: { type: String, required: true },
    orderDetails: { type: String, required: true },
    orderDate: { type: String, required: true },
    buyerId: { type: String, required: true },
    buyerAddress: { type: String, required: true },
    buyerFirstName: { type: String, required: true },
    buyerLastName: { type: String, required: true },
    restaurantId: { type: String, required: true },
    restaurantName: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports=Order;