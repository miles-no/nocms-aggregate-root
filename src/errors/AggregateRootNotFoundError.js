class AggregateRootNotFoundError extends Error {
  constructor(id) {
    super('Aggregate root not found');
    this.aggregateId = id;
    Error.captureStackTrace(this, AggregateRootNotFoundError);
  }
}

module.exports = AggregateRootNotFoundError;
