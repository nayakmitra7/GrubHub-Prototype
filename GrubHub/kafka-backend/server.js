let connection = new require('./kafka/Connection');
let newOrderOwner = require('./services/orders/newOrder');
let confirmedOrderOwner = require('./services/orders/confirmedOrder');
let preparingOrderOwner = require('./services/orders/preparingOrder');
let readyOrderOwner = require('./services/orders/readyOrder');
let cancelledOrderOwner = require('./services/orders/cancelledOrder');
let pastOrderUser = require('./services/orders/pastOrderUser');
let upcomingOrderUser = require('./services/orders/upcomingOrderUser');
let pastOrderOwner = require('./services/orders/pastOrderOwner');
let changeOrderStatus = require('./services/orders/changeStatus');
let cancelOrder = require('./services/orders/cancelOrder');
let placeOrder = require('./services/orders/placeOrder');
let postMessage = require('./services/messages/postMessage');
let receivedMessage = require('./services/messages/receivedMessage');
let sentMessage = require('./services/messages/sentMessage');
let deleteItemMany = require('./services/item/deleteItemMany');
let getSection = require('./services/section/getSection');
let deleteSection = require('./services/section/deleteSection');
let postSection = require('./services/section/postSection');
let updateSection = require('./services/section/updateSection');
let uploadItemImage = require('./services/item/uploadItemImage');
let deleteOneItem = require('./services/item/deleteOneItem');
let getItem = require('./services/item/getItem');
let postItem = require('./services/item/postItem');
let updateItem = require('./services/item/updateItem');
let details = require('./services/restaurant/details');
let detailsBasic = require('./services/restaurant/detailsBasic');
let restaurantSearched = require('./services/restaurant/restaurantSearched');
let updateRestaurant = require('./services/restaurant/updateRestaurant');
let uploadOwnerImage = require('./services/restaurant/uploadOwnerImage');
let uploadRestaurantImage = require('./services/restaurant/uploadRestaurantImage');
let detailsBuyer = require('./services/buyer/details');
let detailsBasicBuyer = require('./services/buyer/detailsBasic');
let updateBuyer = require('./services/buyer/updateBuyer');
let uploadBuyerImage = require('./services/buyer/uploadBuyerImage');
let buyerLogin = require('./services/buyer/loginBuyer');
let restaurantLogin = require('./services/restaurant/loginRestaurant');
let signUpBuyer = require('./services/buyer/signUpBuyer');
let signUpRestaurant = require('./services/restaurant/signUpRestaurant');


const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const { uri } = require('../Backend/config/constants');
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 4 });
const connectionMongoose = mongoose.connection;
connectionMongoose.once('open', () => {
    console.log('Mongo DB Connected successfully!');
})

function handleTopicRequest(topic_name, fname) {
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name + " ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        fname.handle_request(data.data, function (err, res) {
            console.log('after handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });

    });
}
handleTopicRequest("getNewOrderOwner", newOrderOwner);
handleTopicRequest("getConfirmedOrderOwner", confirmedOrderOwner);
handleTopicRequest("getPreparingOrderOwner", preparingOrderOwner);
handleTopicRequest("getReadyOrderOwner", readyOrderOwner);
handleTopicRequest("getCancelledOrderOwner", cancelledOrderOwner);
handleTopicRequest("getPastOrderUser", pastOrderUser);
handleTopicRequest("getUpcomingOrderUser", upcomingOrderUser);
handleTopicRequest("getPastOrderOwner", pastOrderOwner);
handleTopicRequest("postChangeOrderStatus", changeOrderStatus);
handleTopicRequest("postCancelOrder", cancelOrder);
handleTopicRequest("postPlaceOrder", placeOrder);
handleTopicRequest("postMessage", postMessage);
handleTopicRequest("getReceivedMessage", receivedMessage);
handleTopicRequest("getSentMessage", sentMessage);
handleTopicRequest("postSection", postSection);
handleTopicRequest("getSection", getSection);
handleTopicRequest("putSection", updateSection);
handleTopicRequest("deleteItemMany", deleteItemMany);
handleTopicRequest("deleteSection", deleteSection);
handleTopicRequest("postUploadItemImage", uploadItemImage);
handleTopicRequest("deleteOneItem", deleteOneItem);
handleTopicRequest("putUpdateItem", updateItem);
handleTopicRequest("getItem", getItem);
handleTopicRequest("postItem", postItem);
handleTopicRequest("getDetailsRestaurant", details);
handleTopicRequest("putUpdateRestaurant", updateRestaurant);
handleTopicRequest("getDetailsBasicRestaurant", detailsBasic);
handleTopicRequest("postOwnerImage", uploadOwnerImage);
handleTopicRequest("postRestaurantImage", uploadRestaurantImage);
handleTopicRequest("getRestaurantSearched", restaurantSearched);
handleTopicRequest("getDetailsBasicBuyer", detailsBasicBuyer);
handleTopicRequest("getDetailsBuyer", detailsBuyer);
handleTopicRequest("putUpdateBuyer", updateBuyer);
handleTopicRequest("postBuyerImage", uploadBuyerImage);
handleTopicRequest("postBuyerLogin", buyerLogin);
handleTopicRequest("postRestaurantLogin", restaurantLogin);
handleTopicRequest("postBuyerSignup", signUpBuyer);
handleTopicRequest("postOwnerSignup", signUpRestaurant);
