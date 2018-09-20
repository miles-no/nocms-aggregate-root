const CommandValidationError = require('./CommandValidationError');

class AggregateRootAlreadyExistsError extends CommandValidationError {
  constructor(id) {
    super('Aggregate root already exists');
    this.aggregateId = id;
    Error.captureStackTrace(this, AggregateRootAlreadyExistsError);
  }
}

module.exports = AggregateRootAlreadyExistsError;
