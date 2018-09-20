class InvalidCommandError extends Error {
  constructor(id, command) {
    super('Invalid command for aggregate root');
    this.aggregateId = id;
    this.command = command;

    Error.captureStackTrace(this, InvalidCommandError);
  }
}

module.exports = InvalidCommandError;
