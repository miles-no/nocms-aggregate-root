# NoCMS Events

Global events for NoCMS.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependency Status](https://david-dm.org/miles-no/nocms-events.svg)](https://david-dm.org/miles-no/nocms-events)
[![devDependencies](https://david-dm.org/miles-no/nocms-events/dev-status.svg)](https://david-dm.org/miles-no/nocms-events?type=dev)

## Installation

Install nocms-events from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

```
npm install nocms-events --save
```

## Usage

```
import events from 'nocms-events';

events.trigger('form_sent', this.props.store);
```

## API

### listenTo, (eventName, function)
Listen to an event with specified name, and call the function when the event occurs

### stopListenTo, (eventName, function)
Stop listen to the event

### trigger, (eventName, args)
Trigger an event with the specified name and calls each listener's function with the supplied args

## Commit message format and publishing

This repository is published using `semantic-release`, with the default [AngularJS Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit).