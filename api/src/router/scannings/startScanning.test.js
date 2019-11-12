const HttpStatusCode = require('http-status-codes');

const ApiResponse = require('../../lib/core/APIResponse');

const mockModels = require('../../__mocks__/models');

jest.mock('../../models', () => mockModels);

const startScanning = require('./startScanning.js');

describe('Response Handler api Test Suite', () => {
  test('it should return response if no error in payload', async () => {
    const req = {
      params: {
        id: '81f485c986a4b666aee10f3a10d306c2',
      },
    };
    const res = {
      locals: {},
    };
    const mockSave = jest.fn();
    const mockSet = jest.fn();
    mockModels.ScanResult.findById.mockResolvedValue({ status: 'queued', save: mockSave, set: mockSet });
    startScanning.middleware(req, res, (err) => {
      expect(err).toBe(undefined);
      expect(res.locals.apiResponse).toBeInstanceOf(ApiResponse);
      expect(res.locals.apiResponse.statusCode).toBe(HttpStatusCode.OK);
      expect(mockModels.ScanResult.findById).toBeCalled();
      expect(mockSave).toBeCalled();
      expect(mockSet).toBeCalled();
    });
  });

  test('it should return error if scan result is not in queued state.', (done) => {
    const req = {
      params: {
        id: '81f485c986a4b666aee10f3a10d306c2',
      },
    };
    const res = {
      locals: {},
    };
    const mockSave = jest.fn();
    mockModels.ScanResult.findById.mockResolvedValue({ status: 'scanning', save: mockSave });

    startScanning.middleware(req, res, (err) => {
      expect(err).toBeTruthy();
      expect(res.locals.apiResponse).toBe(undefined);
      expect(mockModels.ScanResult.findById).toBeCalled();
      done();
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
    startScanning.middleware(req, res, (err) => {
      expect(err).toBeTruthy();
      expect(res.locals.apiResponse).toBe(undefined);
      expect(mockModels.ScanResult.findById).toBeCalled();
      done();
    });
  });
});
