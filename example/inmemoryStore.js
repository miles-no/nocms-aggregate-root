const AggregateRootNotFoundError = require('../src/errors/AggregateRootNotFoundError');

const store = {};

const api = {
  saveEvent: (event) => {
    const id = event.aggregateId;
    if (!store[id]) {
      store[id] = [event];
    } else {
      store[id].push(event);
    }
  },
  getEvents: (id) => {
    if (!store[id]) {
      throw new AggregateRootNotFoundError(id);
    }
    return store[id];
  },
  markEventDispatched: async (aggregateId, streamRevision) => {
    const event = store[aggregateId].find((e) => {
      return e.streamRevision === streamRevision;
    });
    event.dispatched = true;
    await null;
  },
};

module.exports = api;
