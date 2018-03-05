/* eslint global-require: off */
const test = require('tape');

let sut;

test('listen to event', (t) => {
  t.plan(1);

  sut = require('../lib');
  const callback = () => {
    t.pass('Event listener called');
  };
  sut.listenTo('foo', callback);
  sut.trigger('foo');
  sut.stopListenTo('foo', callback);
});

test('stop listen to should not invoke callback afterwards', (t) => {
  t.plan(1);

  sut = require('../lib');
  const callback = () => {
    t.pass('Event listener called');
  };
  sut.listenTo('foo', callback);
  sut.trigger('foo');
  sut.stopListenTo('foo', callback);
  sut.trigger('foo');
});

test('listen to event with data', (t) => {
  t.plan(1);

  sut = require('../lib');
  const callback = (data) => {
    t.equals('bar', data);
  };
  sut.listenTo('foo', callback);
  sut.trigger('foo', 'bar');
  sut.stopListenTo('foo', callback);
});

test('clear event should remove all listeners', (t) => {
  t.plan(1);

  sut = require('../lib');
  const callback1 = () => { t.fail('cleared callback 1 called'); };
  const callback2 = () => { t.fail('cleared callback 2 called'); };

  sut.listenTo('foo', callback1);
  sut.listenTo('foo', callback2);
  sut.clearEvent('foo');
  sut.trigger('foo');
  t.pass();
});

test('clear non existing event should not throw', (t) => {
  t.plan(1);
  sut = require('../lib');
  try {
    sut.stopListenTo('unknow-event');
    t.pass();
  } catch (e) {
    console.log(e);
    console.log('----------------------------------------------');
    t.fail('Detatching from an unknow event should not throw.');
  }
});
