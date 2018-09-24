const AggregateRootNotFoundError = require('./errors/AggregateRootNotFoundError');
const InvalidCommandError = require('./errors/InvalidCommandError');
const MissingEventHandlerError = require('./errors/MissingEventHandlerError');
const AggregateHasUndispatchedEventsError = require('./errors/AggregateHasUndispatchedEventsError');

let api;
let store;
let bus;
let eventHandlers;
let commandHandlers;

const setStore = (storeApi) => {
  store = storeApi;
  return api;
};

const setBus = (busApi) => {
  bus = busApi;
  return api;
};

const setEventHandlers = (handlers) => {
  eventHandlers = handlers;
  return api;
};

const setCommandHandlers = (handlers) => {
  commandHandlers = handlers;
  return api;
};

const publishEvent = async (event) => {
  if (bus) {
    try {
      await bus.publish(event);
      await store.markEventDispatched(event.aggregateId, event.streamRevision);
    } catch (err) {
      // What if store.markEventDispatched fails? Should be ok if events are idempotent
    }
  }
};

const applyEvent = async (aggregate, event, fromHistory = false) => {
  const payload = event.payload;
  if (!eventHandlers[payload.eventType]) {
    throw new MissingEventHandlerError(payload.eventType, payload);
  }
  const newAggregate = eventHandlers[payload.eventType](aggregate, payload);
  newAggregate.streamRevision = payload.streamRevision;
  newAggregate.dispatched = newAggregate.dispatched && event.dispatched;
  if (!fromHistory) {
    await store.saveEvent(event);
    await publishEvent(event);
  } else if (!event.dispatched) {
    await publishEvent(event);
  }
  return newAggregate;
};

const applyEvents = async (events) => {
  if (!events) {
    return null;
  }
  let aggregate;
  let isAllDispatched = true;
  for (let i = 0, l = events.length; i < l; i += 1) {
    if (!aggregate) {
      aggregate = {};
    }
    aggregate = await applyEvent(aggregate, events[i], true); // eslint-disable-line
    isAllDispatched = isAllDispatched && (events[i].dispatched === true);
  }
  aggregate.dispatched = isAllDispatched;
  return aggregate;
};

const load = async (id) => {
  const events = await store.getEvents(id);
  return await applyEvents(events);
};

const addCommand = async (id, commandName, payload) => {
  const command = {
    id,
    commandName,
    payload,
  };
  let aggregate;

  try {
    aggregate = await load(command.id);
    if (!aggregate.dispatched) {
      throw new AggregateHasUndispatchedEventsError(command.id);
    }
  } catch (error) {
    if (error instanceof AggregateRootNotFoundError) {
      if (!payload.isCreate) {
        throw error;
      }
    } else {
      throw error;
    }
  }

  if (!commandHandlers[commandName]) {
    throw new InvalidCommandError(command.id, commandName);
  }

  const event = commandHandlers[commandName](aggregate, command);
  await applyEvent(aggregate, event);
};

api = {
  addCommand,
  load,
  setStore,
  setBus,
  setEventHandlers,
  setCommandHandlers,
};

module.exports = api;
