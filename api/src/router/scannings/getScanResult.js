const HttpStatusCode = require('http-status-codes');
const commonErrors = require('common-errors');
const Joi = require('@hapi/joi');

Joi.objectId = require('joi-objectid')(Joi);

const ApiResponse = require('../../lib/core/APIResponse');
const errors = require('../../lib/core/errors');

const { ScanResult } = require('../../models');


/**
* Class GetScanResult
*/
class GetScanResult {
  /**
     * Function to map internal errors to http errors
     * @param {Object} error Internal Error object
     *
     * @returns {Object} Returns object having http error and internal error
     */
  static mapErrors(error) {
    const errorMap = {
      [errors.NOT_FOUND]: () => (
        new commonErrors.HttpStatusError(
          HttpStatusCode.NOT_FOUND, {
            message: 'Scan Result not found',
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
     * Get API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
  static async middleware(req, res, next) {
    try {
      const scanResult = await ScanResult.findById(req.params.id);
      if (!scanResult) {
        throw new commonErrors.Error(errors.NOT_FOUND, new Error('record not found.'));
      }
      res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
        data: scanResult.toJSON(),
      });
      next();
    } catch (error) {
      next(GetScanResult.mapErrors(error));
    }
  }
}

module.exports = {
  middleware: GetScanResult.middleware,
};
