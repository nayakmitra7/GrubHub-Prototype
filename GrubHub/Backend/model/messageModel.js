const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderFirstName: { type: String, required: true },
    senderLastName: { type: String },
    receiverFirstName: { type: String, required: true},
    receiverLastName: { type: String},
    messageBody: { type: String },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    orderDate: { type: String, required: true },
    messageDate:{ type: String, required: true }

});

const Message = mongoose.model('Message', messageSchema);
module.exports=Message;