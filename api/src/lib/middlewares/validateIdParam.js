const mongoose = require('mongoose');
const commonErrors = require('common-errors');
const HttpStatusCode = require('http-status-codes');

const { ObjectId } = mongoose.Types;

class ValidateObjectID {
  static async validate(req, res, next) {
    try {
      if (req.params.id && ObjectId.isValid(req.params.id)) {
        throw new commonErrors.HttpStatusError(
          HttpStatusCode.BAD_REQUEUST, {
            message: 'Id parameter is not valid',
          },
        );
      }
      next();
    } catch (error) {
      next({ error });
    }
  }
}

module.exports = ValidateObjectID;
