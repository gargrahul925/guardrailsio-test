const mockError = jest.fn().mockImplementation(
    (message, error) => ({ message, inner_error: error, })
);
module.exports = {
    middleware: {
        errorHandler: {},
    },
    Error: mockError,
    HttpStatusError: jest.fn(),
    ValidationError: jest.fn(),
};
