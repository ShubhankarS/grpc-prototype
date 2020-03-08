var PROTO_PATH = __dirname + '/protos/eventstreaming.proto';
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
var eventGenerator = require("./eventGenerator.js");

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true
  });

var event_proto = grpc.loadPackageDefinition(packageDefinition).eventstreaming;

function main() {
  var client = new event_proto.Greeter('localhost:50051',
    grpc.credentials.createInsecure());

  var eventClient = new event_proto.EventLogger('localhost:50051',
    grpc.credentials.createInsecure());

  // sample hello world call
  client.sayHello({
    name: 'you'
  }, function(err, response) {
    console.log('Greeting:', response.message);
  });

  // post events as a batch
  eventClient.postEvents({
    events: eventGenerator.generateEvents(10)
  }, (err, resp) => {
    console.log("Events posted", err, _.size(resp ? resp.event_ids : []))
  })


  // stream events to server
  var call = eventClient.postEventStream((err, resp) => {
    if (err) {
      console.log("Error in postEventStream", err)
      return;
    }
    console.log("Events acknowledged", _.size(resp ? resp.event_ids : []));
  })

  function eventSender(event, callback) {
    call.write(event);
    _.delay(callback, _.random(1, 10));
  }

  async.eachSeries(eventGenerator.generateEvents(100), eventSender, (e, d) => {
    call.end();
  })
}

main();