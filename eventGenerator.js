var moment = require('moment');
var _ = require('underscore');

exports.generateEvents = (count = 100) => {

  // sample events
  // [{
  //   "event_id": "a_1583671052097",
  //   name: "a",
  //   time: 1583671052097,
  //   params: {
  //     "s": "d",
  //     "m": 1
  //   }
  // }, {
  //   "event_id": "b_1583671052098",
  //   name: "b",
  //   time: 1583671052098,
  //   params: {
  //     "s": "d",
  //     "m": 2
  //   }
  // }]

  let eventCount = count;
  let events = [];
  let start = moment();
  for (var i = 0; i < eventCount; i++) {
    let eventName = _.sample(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])
    let eventTime = start.add(i, 's').valueOf();
    events.push({
      event_id: `${eventName}_${eventTime}`,
      name: eventName,
      time: eventTime,
      params: {
        "s": "d",
        "m": 2
      }
    })
  }

  return events;
}