const HttpStatus = require('http-status-codes');
const ApiResponse = require('../core/APIResponse');
const logger = require('../logger');

module.exports = {
  /**
    * Error handling middleware
    * @param {any} err - Error that should be sent in response
    * @param {any} req - request
    * @param {any} res - request
    * @param {any} next - Next handler to be called
    * @returns {undefined}
    */
  ErrorHandler(err, req, _res, next) {
    if (!err || !err.error) {
      return;
    }
    const { error, innerError } = err;
    const logObject = {};
    if (innerError) {
      logObject.innerError = JSON.stringify(innerError,
        Object.getOwnPropertyNames(innerError));
    }
    logObject.errorMessage = (typeof error.message) !== 'string'
      ? JSON.stringify(error.message) : error.message;
    logObject.errorName = error.name;
    logObject.errorStack = error.stack;
    Object.keys(req.body).forEach((key) => {
      logObject[key] = (typeof req.body[key]) !== 'string'
        ? JSON.stringify(req.body[key]) : req.body[key];
    });
    Object.keys(req.query).forEach((key) => {
      logObject[key] = (typeof req.query[key]) !== 'string'
        ? JSON.stringify(req.query[key]) : req.query[key];
    });
    logger.error(logObject);
    next(error);
  },
  OkHandler(req, res) {
    const { apiResponse } = res.locals;
    if (apiResponse instanceof ApiResponse) {
      if (!apiResponse.type || apiResponse.type === 'json') {
        res.status(apiResponse.statusCode).json(apiResponse.data);
      }
    } else {
      res.status(HttpStatus.NOT_FOUND).json(apiResponse);
    }
  },
};
