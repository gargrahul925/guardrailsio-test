const HttpStatusCode = require('http-status-codes');
const commonErrors = require('common-errors');

const ApiResponse = require('../../lib/core/APIResponse');
const errors = require('../../lib/core/errors');

const { ScanResult } = require('../../models');


/**
* Class ListScanResult
*/
class ListScanResult {
  /**
     * Function to map internal errors to http errors
     * @param {Object} error Internal Error object
     *
     * @returns {Object} Returns object having http error and internal error
     */
  static mapErrors(error) {
    const errorMap = {
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
     * List API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
  static async middleware(req, res, next) {
    try {
      // Filters can be added Ex: to list only complete tasks so on.
      // By default filtering out findings while listing scan results.
      const scanResults = await ScanResult.find({}, { findings: 0 });
      res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
        data: {
          records: scanResults,
          count: scanResults.length,
        },
      });
      next();
    } catch (error) {
      next(ListScanResult.mapErrors(error));
    }
  }
}

module.exports = {
  middleware: ListScanResult.middleware,
};
