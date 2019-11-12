const HttpStatusCode = require('http-status-codes');

const ApiResponse = require('../../lib/core/APIResponse');

const mockModels = require('../../__mocks__/models');

jest.mock('../../models', () => mockModels);

const listScanResults = require('./listScanResults.js');

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
    mockModels.ScanResult.find.mockResolvedValue([]);
    listScanResults.middleware(req, res, (err) => {
      expect(err).toBe(undefined);
      expect(res.locals.apiResponse).toBeInstanceOf(ApiResponse);
      expect(res.locals.apiResponse.statusCode).toBe(HttpStatusCode.OK);
      expect(mockModels.ScanResult.find).toBeCalled();
    });
  });
});
