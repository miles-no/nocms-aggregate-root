/**
 * Some of the tests mocks out the bus, which is a singleton, and they need to run using test.serial
 * Keep in mind that if you need to mock out the singletons store and bus, the test needs to clean up after assertion.
 */

import test from 'ava';

const sut = require('../src');
const inmemoryStore = require('./helpers/inmemoryStore');
const inmemoryBus = require('./helpers/inmemoryBus');
const AggregateRootNotFoundError = require('../src/errors/AggregateRootNotFoundError');
const AggregateHasUndispatchedEventsError = require('../src/errors/AggregateHasUndispatchedEventsError');
const InvalidCommandError = require('../src/errors/InvalidCommandError');

const eventHandlers = require('../example/event_handlers');
const commandHandlers = require('../example/command_handlers');

sut
  .setEventHandlers(eventHandlers)
  .setCommandHandlers(commandHandlers)
  .setStore(inmemoryStore)
  .setBus(inmemoryBus);

let i = 1;
const newId = () => {
  return (i += 1).toString();
};

const throwingPublishBus = {
  publish: () => {
    throw new Error('foo');
  },
};

test('getting unknown aggregate root', async (t) => {
  const error = await t.throwsAsync(async () => {
    await sut.load('1');
  }, AggregateRootNotFoundError);

  t.is(error.aggregateId, '1');
});

test('create aggegate root', async (t) => {
  const id = newId();
  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  const aggregate = await sut.load(id);
  t.is(aggregate.name, 'Foo');
});

test('adding commands on not found aggregates should fail', async (t) => {
  const id = newId();
  const error = await t.throwsAsync(async () => {
    await sut.addCommand(id, 'fooCommand', { name: 'Foo' });
  }, AggregateRootNotFoundError);

  t.is(error.aggregateId, id);
});

test('running invalid commands should fail', async (t) => {
  const id = newId();
  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  const error = await t.throwsAsync(async () => {
    await sut.addCommand(id, 'fooCommand', { name: 'Foo' });
  }, InvalidCommandError);

  t.is(error.command, 'fooCommand');
  t.is(error.aggregateId, id);
});

test('setting email on aggegate root', async (t) => {
  const id = newId();
  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  await sut.addCommand(id, 'changeCustomerEmail', { email: 'foo@bar.com' });

  let aggregate = await sut.load(id);
  t.is(aggregate.email, 'foo@bar.com');
  t.is(aggregate.streamRevision, 2);

  await sut.addCommand(id, 'changeCustomerEmail', { email: 'name@example.com' });
  aggregate = await sut.load(id);
  t.is(aggregate.email, 'name@example.com');
  t.is(aggregate.streamRevision, 3);
});

test('running command will increase revision', async (t) => {
  const id = newId();

  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  let aggregate = await sut.load(id);
  t.is(aggregate.streamRevision, 1);
  await sut.addCommand(id, 'changeCustomerEmail', { email: 'foo@bar.com' });
  aggregate = await sut.load(id);
  t.is(aggregate.streamRevision, 2);
});

test.serial('events should be published', async (t) => {
  const id = newId();
  let hasBeenCalled = 0;
  const fn = () => {
    hasBeenCalled += 1;
  };
  inmemoryBus.subscribe('customerEmailChangedEvent', fn);
  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  await sut.addCommand(id, 'changeCustomerEmail', { email: 'foo@bar.com' });
  inmemoryBus.unsubscribe('customerEmailChangedEvent', fn);
  t.is(hasBeenCalled, 1, 'event handler for changeCustomerEmail should have been called');
});

test.serial('events from history should not be published', async (t) => {
  const id = newId();
  let hasBeenCalled = 0;
  const fn = () => {
    t.fail('Events from history should not be called');
    hasBeenCalled += 1;
  };

  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  inmemoryBus.subscribe('customerEmailChangedEvent', fn);
  await sut.load(id); // Load events from history
  t.is(hasBeenCalled, 0);
  inmemoryBus.unsubscribe('customerEmailChangedEvent', fn);
});

test.serial('events should be undispatched before publishing', async (t) => {
  const id = newId();
  sut.setBus(null);
  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  const aggregate = await sut.load(id);
  sut.setBus(inmemoryBus);
  t.is(aggregate.dispatched, false);
});

test('events should be dispatched after publishing', async (t) => {
  const id = newId();
  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  const aggregate = await sut.load(id);
  t.is(aggregate.dispatched, true);
});

test.serial('events should be undispatched if publish fails', async (t) => {
  const id = newId();
  sut.setBus(throwingPublishBus);
  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  const aggregate = await sut.load(id);
  sut.setBus(inmemoryBus);
  t.is(aggregate.streamRevision, 1);
  t.is(aggregate.dispatched, false);
});

test.serial('undispatched events should be dispatched when loading', async (t) => {
  const id = newId();
  sut.setBus(throwingPublishBus);
  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });

  let aggregate = await sut.load(id);
  t.is(aggregate.streamRevision, 1);
  t.is(aggregate.dispatched, false);

  sut.setBus(inmemoryBus);
  aggregate = await sut.load(id);
  t.is(aggregate.streamRevision, 1);
  t.is(aggregate.dispatched, true);
});

test.serial('adding commands on aggragate root with undispatched events should fail', async (t) => {
  const id = newId();
  sut.setBus(throwingPublishBus);
  await sut.addCommand(id, 'createCustomer', { name: 'Foo', isCreate: true });
  await t.throwsAsync(async () => {
    await sut.addCommand(id, 'changeCustomerEmail', { email: 'foo@bar.com' });
  }, AggregateHasUndispatchedEventsError);
  sut.setBus(inmemoryBus);
});
