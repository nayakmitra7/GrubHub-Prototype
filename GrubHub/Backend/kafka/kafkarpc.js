var crypto = require('crypto');
var conn = require('./Connection');

var TIMEOUT=8000; 
var self;

exports = module.exports =  KafkaRPC;

function KafkaRPC(){
    self = this;
    this.connection = conn;
    this.requests = {}; 
    this.response_queue = false; 
    this.producer = this.connection.getProducer();
}

KafkaRPC.prototype.makeRequest = function(topic_name, content, callback){

    self = this;
    var correlationId = crypto.randomBytes(16).toString('hex');
    var tId = setTimeout(function(corr_id){
        callback(new Error("timeout " + corr_id));
        delete self.requests[corr_id];
    }, TIMEOUT, correlationId);

    var entry = {
        callback:callback,
        timeout: tId 
    };
    self.requests[correlationId]=entry;
    self.setupResponseQueue(self.producer,topic_name,function(){
        var payloads = [
            { topic: topic_name, messages: JSON.stringify({
                correlationId:correlationId,
                replyTo:'responseTopic',
                data:content}),
                partition:0}
        ];
        console.log(self.producer.ready);
        self.producer.send(payloads, function(err, data){
            if(err)
                console.log(err);
            console.log(data);
        });
    });
};


KafkaRPC.prototype.setupResponseQueue = function(producer,topic_name, next){
    //don't mess around if we have a queue
    if(this.response_queue) return next();
    self = this;

    //subscribe to messages
    var consumer = self.connection.getConsumer('responseTopic');
    consumer.on('message', function (message) {
        var data = JSON.parse(message.value);
        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if(correlationId in self.requests){
            //retrieve the request entry
            var entry = self.requests[correlationId];
            //make sure we don't timeout by clearing it
            clearTimeout(entry.timeout);
            //delete the entry from hash
            delete self.requests[correlationId];
            //callback, no err
            entry.callback(null, data.data);
        }
    });
    self.response_queue = true;
    return next();
};