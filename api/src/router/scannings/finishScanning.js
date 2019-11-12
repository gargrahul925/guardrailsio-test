const HttpStatusCode = require('http-status-codes');
const commonErrors = require('common-errors');
const Joi = require('@hapi/joi');

const ApiResponse = require('../../lib/core/APIResponse');
const errors = require('../../lib/core/errors');

const { ScanResult } = require('../../models');


/**
* Class FinishScanning
*/
class FinishScanning {
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
    const findingSchema = Joi.object().keys({
      type: Joi.string().required(),
      ruleId: Joi.string().required(),
      location: Joi.object().required(),
      metadata: Joi.object().required(),
    });

    const schema = Joi.object().keys({
      status: Joi.string().valid('success').valid('failed'),
      findings: Joi.array().items(findingSchema),
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
      FinishScanning.validate(req.body);
      const scanResult = await ScanResult.findById(req.params.id);
      if (!scanResult) {
        throw new commonErrors.Error(errors.NOT_FOUND, new Error('Invalid result Id'));
      }
      if (scanResult.status !== 'in-progress') {
        throw new commonErrors.Error(errors.ERR_INVALID_ARGS, new Error('Only running job can be finished.'));
      }
      scanResult.set({
        status: req.body.status,
        finishedAt: new Date().getTime(),
        findings: req.body.findings,
      });
      await scanResult.save();
      res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
        message: 'Scanning completed and Findings are logged.',
      });
      next();
    } catch (error) {
      next(FinishScanning.mapErrors(error));
    }
  }
}

module.exports = {
  middleware: FinishScanning.middleware,
};
