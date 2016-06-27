# NoCMS Events

Global events for NoCMS.


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
