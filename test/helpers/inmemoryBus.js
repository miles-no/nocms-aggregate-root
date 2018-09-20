const eventHandlers = {};

const publish = (event) => {
  const name = event.eventType;
  if (eventHandlers[name]) {
    eventHandlers[name].forEach((eventHandler) => {
      eventHandler(event);
    });
  }
};

const subscribe = (name, fn) => {
  if (!eventHandlers[name]) {
    eventHandlers[name] = [];
  }
  eventHandlers[name].push(fn);
};

const unsubscribe = (name, fn) => {
  if (!eventHandlers[name]) {
    return;
  }
  const index = eventHandlers[name].indexOf(fn);
  if (index !== -1) {
    eventHandlers[name].splice(index, 1);
  }
};

const api = {
  publish,
  subscribe,
  unsubscribe,
};

module.exports = api;
