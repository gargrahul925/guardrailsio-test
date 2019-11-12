const mockLogger = require('../../__mocks__/logger');

jest.mock('../logger', () => mockLogger);

const ApiResponse = require('../../lib/core/APIResponse');
const responseHandler = require('./responseHandler.js');


describe('Response Handler api Test Suite', () => {
  beforeEach(() => {
    mockLogger.error.mockClear();
  });

  test('it should return results successfully for type undefined or json', (done) => {
    const req = {};
    const data = { propA: 'hello', propB: 'hi' };
    const statusCode = 200;
    const dataArr = Object.keys(data);
    const responseObj = new ApiResponse(statusCode, data);
    const mockedJson = jest.fn();
    mockedJson.mockReturnValue(data);

    const mockedStatus = jest.fn();
    mockedStatus.mockReturnValue({
      json: mockedJson,
    });

    const res = {
      locals: {
        apiResponse: responseObj,
      },
      status: mockedStatus,
    };
    responseHandler.OkHandler(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(mockedJson).toHaveReturnedWith(data);
    expect(res.locals.apiResponse.data).toHaveProperty(dataArr[0]);
    expect(res.locals.apiResponse.data).toHaveProperty(dataArr[1]);
    done();
  });


  test('it should return error', (done) => {
    const req = {};
    const statusCode = 404;

    const mockedJson = jest.fn();
    mockedJson.mockReturnValue();

    const mockedStatus = jest.fn();
    mockedStatus.mockReturnValue({
      json: mockedJson,
    });

    const res = {
      locals: {},
      status: mockedStatus,
    };
    const finalData = responseHandler.OkHandler(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(mockedJson).toHaveReturned();
    expect(mockedJson).toHaveReturnedWith(undefined);
    expect(finalData).toBeUndefined();
    done();
  });

  test('it return if error is null', () => {
    const next = jest.fn();
    responseHandler.ErrorHandler({ error: null }, null, null, next);
    responseHandler.ErrorHandler(null, null, null, next);
    expect(mockLogger.error).toHaveBeenCalledTimes(0);
    expect(next).toHaveBeenCalledTimes(0);
  });

  test('it should return error', () => {
    const error = {
      message: 'Invalid param(s)',
      stack: '',
      name: 'Error',
    };
    const req = {
      body: {
        a: 'test',
        b: 'test1',
        c: [
          '1', '2',
        ],
        d: [
          1, 2,
        ],
        e: {
          ea: '1',
        },
      },
      query: {
        x: 'query',
        y: { ya: 'query' },
      },
    };
    const next = jest.fn();
    const res = {
      locals: {},
    };
    responseHandler.ErrorHandler({ error }, req, res, next);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith({
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
      a: req.body.a,
      b: req.body.b,
      c: JSON.stringify(req.body.c),
      d: JSON.stringify(req.body.d),
      e: JSON.stringify(req.body.e),
      x: req.query.x,
      y: JSON.stringify(req.query.y),
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  test('it should return error, if message is not a simple string', () => {
    const error = {
      message: {
        description: 'Description',
        message: 'message',
      },
      stack: '',
      name: 'Error',
    };
    const innerError = {
      message: 'Inner Error',
      stack: 'Inner Stack',
    };
    const req = {
      body: {
      },
      query: {
      },
    };
    const next = jest.fn();
    next.mockReturnValue(error);
    const res = {
      locals: {},
    };
    responseHandler.ErrorHandler({ error, innerError }, req, res, next);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith({
      innerError: JSON.stringify(innerError),
      errorMessage: JSON.stringify(error.message),
      errorStack: error.stack,
      errorName: error.name,
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
