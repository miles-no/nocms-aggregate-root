const AggregateRootAlreadyExistsError = require('../src/errors/AggregateRootAlreadyExistsError');

const commandHandlers = {
  createCustomer: (aggregate, command) => {
    if (aggregate) {
      throw new AggregateRootAlreadyExistsError();
    }
    const event = {
      aggregateId: command.id,
      eventType: 'customerCreatedEvent',
      streamRevision: 1,
      payload: {
        customerId: command.id,
        name: command.payload.name,
        eventType: 'customerCreatedEvent',
        streamRevision: 1,
      },
    };
    return event;
  },
  changeCustomerEmail: (aggregate, command) => {
    const event = {
      aggregateId: command.id,
      eventType: 'customerEmailChangedEvent',
      streamRevision: aggregate.streamRevision + 1,
      payload: {
        customerId: command.id,
        email: command.payload.email,
        oldValue: aggregate.email,
        eventType: 'customerEmailChangedEvent',
        streamRevision: aggregate.streamRevision + 1,
      },
    };
    return event;
  },
};

module.exports = commandHandlers;
