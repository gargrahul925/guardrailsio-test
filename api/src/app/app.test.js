const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const commonErrors = require('common-errors');
const config = require('config');
const mockRouter = require('../__mocks__/router');

jest.mock('./../router', () => mockRouter);

const mockBaseURIParam = 'api.BASE_URI';
const mockConfig = {
  enableSwagger: false,
  [mockBaseURIParam]: '/xyz',
};

config.get.mockImplementation(key => mockConfig[key]);

const mockOkHandler = jest.fn();
const mockErrorHandler = jest.fn();
const mockValidateIdParam = jest.fn();
const mockResponseHandler = {
  OkHandler: mockOkHandler,
  ErrorHandler: mockErrorHandler,
};

jest.mock('../lib/middlewares', () => ({
  validateIdParam: mockValidateIdParam,
  responseHandler: mockResponseHandler,
}));

const mockConnectDb = jest.fn();

jest.mock('../models', () => ({
  connectDb: mockConnectDb,
}));

const app = require('./app');

describe('app test cases', () => {
  test('if all middlewares are called in right order', async () => {
    const mockExpress = await app.createApp();
    expect(mockExpress.use).toHaveBeenNthCalledWith(1, bodyParser.json());
    expect(mockExpress.use).toHaveBeenNthCalledWith(2, cors());
    expect(mockExpress.use).toHaveBeenNthCalledWith(3, compression());
    expect(mockExpress.use).toHaveBeenNthCalledWith(4, mockValidateIdParam);
    expect(mockExpress.use).toHaveBeenNthCalledWith(5,
      mockConfig[mockBaseURIParam], mockRouter);
    expect(mockExpress.use).toHaveBeenNthCalledWith(6, mockOkHandler);
    expect(mockExpress.use).toHaveBeenNthCalledWith(7, mockErrorHandler);
    expect(mockExpress.use).toHaveBeenNthCalledWith(8,
      commonErrors.middleware.errorHandler);
    expect(mockExpress.use).toBeCalledTimes(8);
    expect(mockConnectDb).toBeCalled();
  });
});
