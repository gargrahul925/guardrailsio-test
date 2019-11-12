module.exports = {
  ERR_INVALID_ARGS: 'ERR_INVALID_ARGS',
  NOT_FOUND: 'NOT_FOUND',
  addInnerError: (error, innerError) => {
    const xError = {
      error,
      innerError,
    };
    return xError;
  },
};
