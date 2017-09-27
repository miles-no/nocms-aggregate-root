const eventListeners = {};

const listenTo = (eventName, func) => {
  if (typeof func !== 'function') {
    /* eslint no-console: off */
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

const trigger = (eventName, ...args) => {
  if (!eventListeners[eventName]) {
    return;
  }
  eventListeners[eventName].forEach((f) => {
    f.apply(this, args);
  });
};

const clearEvent = (eventName) => {
  delete eventListeners[eventName];
};

module.exports = {
  listenTo,
  stopListenTo,
  trigger,
  clearEvent,
};
