const HttpStatusCode = require('http-status-codes');
const commonErrors = require('common-errors');
const Joi = require('@hapi/joi');

const ApiResponse = require('../../lib/core/APIResponse');
const errors = require('../../lib/core/errors');

const { ScanResult } = require('../../models');


/**
* Class AddToQueue
*/
class AddToQueue {
  /**
     * Function to map internal errors to http errors
     * @param {Object} error Internal Error object
     *
     * @returns {Object} Returns object having http error and internal error
     */
  static mapErrors(error) {
    const errorMap = {
      [errors.ERR_INVALID_ARGS]: () => (
        new commonErrors.HttpStatusError(
          HttpStatusCode.BAD_REQUEST, {
            message: 'User Input is not valid.',
          },
        )
      ),
      default: () => (new commonErrors.HttpStatusError(
        HttpStatusCode.INTERNAL_SERVER_ERROR, {
          message: error.message,
        },
      )),
    };
    if (errorMap[error.message]) {
      return errors.addInnerError(errorMap[error.message](), error);
    }
    return errors.addInnerError(errorMap.default(), error);
  }

  /**
     * Function to validate the input request
     * @param {Object} params Parameters passed to reequest query
     *
     * @returns {Error} Returns null if the parameters are valid
     *                    else returns an error object (ValidationError)
     */
  static validate(params) {
    const schema = Joi.object().keys({
      repositoryName: Joi.string().required(),
    });
    const {
      error,
    } = schema.validate(params);
    if (error != null) {
      throw new commonErrors.Error(errors.ERR_INVALID_ARGS, error);
    }
  }

  /**
     * Post API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
  static async middleware(req, res, next) {
    try {
      AddToQueue.validate(req.body);
      const data = Object.assign({}, req.body, { queuedAt: new Date().getTime() });
      const scanResult = new ScanResult(data);
      const result = await scanResult.save();
      res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
        data: result.toJSON(),
      });
      next();
    } catch (error) {
      next(AddToQueue.mapErrors(error));
    }
  }
}

module.exports = {
  middleware: AddToQueue.middleware,
};
