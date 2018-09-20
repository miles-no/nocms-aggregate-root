class MSSQLError extends Error {
  constructor(msg, context) {
    super(msg);
    this.context = context;

    Error.captureStackTrace(this, MSSQLError);
  }
}

module.exports = MSSQLError;
