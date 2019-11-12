const HttpStatusCode = require('http-status-codes');
const commonErrors = require('common-errors');

const ApiResponse = require('../../lib/core/APIResponse');
const errors = require('../../lib/core/errors');

const { ScanResult } = require('../../models');


/**
* Class StartScanning
*/
class StartScanning {
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
     * Post API
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
        throw new commonErrors.Error(errors.NOT_FOUND, new Error('Invalid result Id'));
      }
      if (scanResult.status !== 'queued') {
        throw new commonErrors.Error(errors.ERR_INVALID_ARGS, new Error('Only queued job can be pushed for scanning.'));
      }
      scanResult.set({ status: 'in-progress', scanningAt: new Date().getTime() });
      await scanResult.save();
      res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
        message: 'Scanning started',
      });
      next();
    } catch (error) {
      next(StartScanning.mapErrors(error));
    }
  }
}

module.exports = {
  middleware: StartScanning.middleware,
};
