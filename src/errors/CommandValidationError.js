class CommandValidationError extends Error {
  constructor(msg) {
    super(msg);
    Error.captureStackTrace(this, CommandValidationError);
  }
}

module.exports = CommandValidationError;
