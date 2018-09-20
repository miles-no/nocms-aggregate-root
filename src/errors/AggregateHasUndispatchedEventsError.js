class AggregateHasUndispatchedEventsError extends Error {
  constructor(id) {
    super('Aggregate has undispatched events');
    this.aggregateId = id;
    Error.captureStackTrace(this, AggregateHasUndispatchedEventsError);
  }
}

module.exports = AggregateHasUndispatchedEventsError;
