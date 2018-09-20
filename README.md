# NoCMS Event Sourcing - Aggregate Root

This is an aggregate root used for event sourcing in node.js. The aggregate root can be configured with a custom event store. It save events raised by commands and iterates over them, returning the final result. An optional custom event bus can also be applied.

Packages for Azure SQL store, Azure Service Bus, and RabbitMQ will eventually be available.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependency Status](https://david-dm.org/miles-no/nocms-aggregate-root.svg)](https://david-dm.org/miles-no/nocms-events)
[![devDependencies](https://david-dm.org/miles-no/nocms-aggregate-root/dev-status.svg)](https://david-dm.org/miles-no/nocms-events?type=dev)

## Installation
Install using npm: `npm i nocms-aggregate-root -S`

## Usage

### Example
```
const customerAggregateRoot = require('nocms-aggregate-root');
customerAggregateRoot
  .setStore(store)
  .setCommandHandlers(commandHandlers)
  .setEventHandlers(eventHandlers);

await customerAggregateRoot.addCommand(id, 'createCustomer', { name: 'Jørgen', isCreate: true });
const customer = await customerAggregateRoot.load(id); // { name: 'Jørgen', streamRevision: 1, id: '1', dispatched: false }
```
Visit the `example/` folder for a complete, running example.


### Creating the store
The aggregate root requires a store for saving events in a stream. The store should be provided, using the `setStore` function, which takes an object with the following API:

#### saveEvent(event)
The event object represents an occurence of a certain event in time. The following fields are required:

| Field         | Description                                    |
|===============|================================================|
| aggregateId   | Id of the aggregate root, which is used to group all the events |
| eventType     | Name of the event type, which is used to resolve the event handler |
| streamRevision | Revision number of the event stream, used for chronologically ordering the events |
| payload       | Object for the data of the event.                                                  |


#### getEvents(aggregateId)
Should return an array of all the events of an aggregate identified by aggregateId, ordered by stream revision.

#### markEventDispatched(aggregateId, streamRevision)
When an event bus is used, in order to make sure that an event is published on the bus, the event is initially flagged as undispatched. After a successful `bus.publish` is called (automatically invoked by this package), store.markEventDispatched is also automatically invoked.

This function should set `dispatched = true` on the event identified by aggregateId and streamRevision.

### Creating the bus




## Commit message format and publishing

This repository is published using `semantic-release`, with the default [AngularJS Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit).