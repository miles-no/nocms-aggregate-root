const eventHandlers = {
  customerCreatedEvent: (aggregate, payload) => {
    return {
      name: payload.name,
      streamRevision: 1,
      id: payload.customerId,
    };
  },
  customerEmailChangedEvent: (aggregate, payload) => {
    const update = { email: payload.email, streamRevision: payload.streamRevision };
    const result = Object.assign(aggregate, update);
    return result;
  },
};

module.exports = eventHandlers;
