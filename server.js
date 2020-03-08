var PROTO_PATH = __dirname + '/protos/eventstreaming.proto';

var grpc = require('grpc');
var moment = require('moment');
var _ = require('underscore');

var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: Number,
    enums: String,
    defaults: false,
    oneofs: true
  });

var event_proto = grpc.loadPackageDefinition(packageDefinition).eventstreaming;

function sayHello(call, callback) {
  callback(null, {
    message: 'Hello ' + call.request.name
  });
}

function saveEvents(call, callback) {
  console.log(`Saving events`, _.size(call.request.events));
  callback(null, {
    event_ids: _.pluck(call.request.events, "event_id")
  });
}

function saveEventStream(call, callback) {
  console.log(`Saving event stream`);
  let events = [];
  let count = 0;
  call.on("data", function(event) {
    count++;
    events.push(event);
    console.log(`Receiving event batch ${count}`)
  });

  call.on("end", () => {
    console.log("Call ending");
    callback(null, {
      event_ids: _.pluck(events, "event_id")
    });
  })
}

function main() {
  var server = new grpc.Server();

  server.addService(event_proto.Greeter.service, {
    sayHello: sayHello
  });

  server.addService(event_proto.EventLogger.service, {
    postEvents: saveEvents,
    postEventStream: saveEventStream
  });

  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();