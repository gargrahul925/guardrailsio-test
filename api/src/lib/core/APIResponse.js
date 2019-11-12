/**
 * Api response wrapper when sending Ok responses
 * @param {any} statusCode Http status code
 * @param {any} data Data to be sent as response
 * @param {String} type Http response content type
 * @returns {undefined}
 */
function ApiResponse(statusCode, data, type) {
  this.statusCode = statusCode;
  this.data = data;
  this.type = type || 'json';
}

module.exports = ApiResponse;
