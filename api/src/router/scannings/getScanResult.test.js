const HttpStatusCode = require('http-status-codes');

const ApiResponse = require('../../lib/core/APIResponse');

const mockModels = require('../../__mocks__/models');

jest.mock('../../models', () => mockModels);

const getScanResult = require('./getScanResult.js');

describe('Response Handler api Test Suite', () => {
  test('it should return response if no error in param id', async () => {
    const req = {
      params: {
        id: '81f485c986a4b666aee10f3a10d306c2',
      },
    };
    const res = {
      locals: {},
    };
    const mockToJSON = jest.fn();
    mockModels.ScanResult.findById.mockResolvedValue({ status: 'queued', toJSON: mockToJSON });
    getScanResult.middleware(req, res, (err) => {
      expect(err).toBe(undefined);
      expect(res.locals.apiResponse).toBeInstanceOf(ApiResponse);
      expect(res.locals.apiResponse.statusCode).toBe(HttpStatusCode.OK);
      expect(mockModels.ScanResult.findById).toBeCalled();
      expect(mockToJSON).toBeCalled();
    });
  });


  test('it should return error if id is not valid.', (done) => {
    const req = {
      params: {
        id: '81f485c986a4b666aee10f3a10d306c2',
      },
    };
    const res = {
      locals: {},
    };
    mockModels.ScanResult.findById.mockResolvedValue(null);
    getScanResult.middleware(req, res, (err) => {
      expect(err).toBeTruthy();
      expect(res.locals.apiResponse).toBe(undefined);
      expect(mockModels.ScanResult.findById).toBeCalled();
      done();
    });
  });
});
