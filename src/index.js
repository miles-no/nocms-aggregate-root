/* eslint no-underscore-dangle: off */
const eventListeners = {};

if (!global._nocmsEventListeners) {
  global._nocmsEventListeners = {};
}

const _trigger = (eventName, eventStore, ...args) => {
  if (!eventStore[eventName]) {
    return;
  }
  const subscribers = eventStore[eventName].slice();
  subscribers.forEach((f) => {
    f.apply(this, args);
  });
};

const _listenTo = (eventName, func, eventStore) => {
  if (typeof func !== 'function') {
    /* eslint no-console: off */
    /* eslint no-param-reassign: off  */
    console.error(`Listener to ${eventName}  is not a function`);
    return;
  }
  if (!eventStore[eventName]) {
    eventStore[eventName] = [];
  }
  eventStore[eventName].push(func);
};

const _stopListenTo = (eventName, func, eventStore) => {
  if (!eventStore[eventName]) {
    return;
  }
  const index = eventStore[eventName].indexOf(func);
  if (index !== -1) {
    eventStore[eventName].splice(index, 1);
  }
};

const _clearEvent = (eventName, eventStore = eventListeners) => {
  delete eventStore[eventName];
};

const trigger = (eventName, ...args) => {
  _trigger(eventName, eventListeners, ...args);
};

const listenTo = (eventName, func) => {
  _listenTo(eventName, func, eventListeners);
};

const stopListenTo = (eventName, func) => {
  _stopListenTo(eventName, func, eventListeners);
};

const clearEvent = (eventName) => {
  _clearEvent(eventName, eventListeners);
};

const triggerGlobal = (eventName, ...args) => {
  _trigger(eventName, global._nocmsEventListeners, ...args);
};

const listenToGlobal = (eventName, func) => {
  _listenTo(eventName, func, global._nocmsEventListeners);
};

const stopListenToGlobal = (eventName, func) => {
  _stopListenTo(eventName, func, global._nocmsEventListeners);
};

const clearEventGlobal = (eventName) => {
  _clearEvent(eventName, global._nocmsEventListeners);
};


module.exports = {
  listenTo,
  listenToGlobal,
  stopListenTo,
  stopListenToGlobal,
  trigger,
  triggerGlobal,
  clearEvent,
  clearEventGlobal,
};
