const eventListeners = {};

const listenTo = (eventName, func) => {
  if (typeof func !== 'function') {
    console.error(`Listener to ${eventName}  is not a function`);
    return;
  }
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  eventListeners[eventName].push(func);
};

const stopListenTo = (eventName, func) => {
  const index = eventListeners[eventName].indexOf(func);
  if (index !== -1) {
    eventListeners[eventName].splice(index, 1);
  }
};

const trigger = (eventName) => {
  const args = Array.prototype.splice.call(arguments, 1);
  if (!eventListeners[eventName]) {
    return;
  }
  eventListeners[eventName].forEach(function (f) {
    f.apply(this, args);
  });
};


module.exports = {
  listenTo,
  stopListenTo,
  trigger,
};
