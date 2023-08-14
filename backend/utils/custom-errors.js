class CustomError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
      this.name = this.constructor.name;
      this.status = statusCode;
    }
  }
  
  module.exports = CustomError;
  