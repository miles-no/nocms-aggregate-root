const bus = require('./inmemoryBus');
const store = require('./inmemoryStore');
const commandHandlers = require('./command_handlers');
const eventHandlers = require('./event_handlers');

const customerAggregateRoot = require('../src').api;

customerAggregateRoot
  .setBus(bus)
  .setStore(store)
  .setCommandHandlers(commandHandlers)
  .setEventHandlers(eventHandlers);

(async () => {
  await customerAggregateRoot.addCommand('1', 'createCustomer', { name: 'Jørgen', isCreate: true });
  const customer = await customerAggregateRoot.load('1');
  console.log(customer); // eslint-disable-line
})();
