'use strict';

var eventListeners = {};

var listenTo = function listenTo(eventName, func) {
  if (typeof func !== 'function') {
    console.error('Listener to ' + eventName + '  is not a function');
    return;
  }
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  eventListeners[eventName].push(func);
};

var stopListenTo = function stopListenTo(eventName, func) {
  var index = eventListeners[eventName].indexOf(func);
  if (index !== -1) {
    eventListeners[eventName].splice(index, 1);
  }
};

var trigger = function trigger(eventName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (!eventListeners[eventName]) {
    return;
  }
  eventListeners[eventName].forEach(function (f) {
    f.apply(undefined, args);
  });
};

var clearEvent = function clearEvent(eventName) {
  delete eventListeners[eventName];
};

module.exports = {
  listenTo: listenTo,
  stopListenTo: stopListenTo,
  trigger: trigger,
  clearEvent: clearEvent
};
//# sourceMappingURL=index.js.map