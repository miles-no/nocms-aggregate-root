class MissingEventHandlerError extends Error {
  constructor(eventHandler, payload) {
    super('Missing event handler');
    this.eventHandler = eventHandler;
    this.payload = payload;
    Error.captureStackTrace(this, MissingEventHandlerError);
  }
}

module.exports = MissingEventHandlerError;
