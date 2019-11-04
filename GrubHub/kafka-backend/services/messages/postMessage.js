let messages = require("../../model/messageModel");

function handle_request(req, callback) {
  const senderFirstName = req.senderFirstName;
  const senderLastName = req.senderLastName;
  const receiverFirstName = req.receiverFirstName;
  const receiverLastName = req.receiverLastName;
  const messageBody = req.message;
  const senderId = req.senderId;
  const receiverId = req.receiverId;
  const orderDate = req.orderDate;
  const messageDate = req.messageDate;
  const newMessage = new messages({
    senderFirstName,
    senderLastName,
    receiverFirstName,
    receiverLastName,
    messageBody,
    senderId,
    receiverId,
    orderDate,
    messageDate
  });
  newMessage.save((err, message) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, message);
    }
  });
}

exports.handle_request = handle_request;
