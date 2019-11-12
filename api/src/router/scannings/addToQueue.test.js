const HttpStatusCode = require('http-status-codes');

const ApiResponse = require('../../lib/core/APIResponse');

const mockModels = require('../../__mocks__/models');

jest.mock('../../models', () => mockModels);

const addToQueue = require('./addToQueue.js');

describe('Response Handler api Test Suite', () => {
  test('it should return response if no error in payload', async () => {
    const req = {
      body: {
        repositoryName: 'https://github/gargrahul925/test',
      },
    };
    const res = {
      locals: {},
    };
    addToQueue.middleware(req, res, () => {
      expect(res.locals.apiResponse).toBeInstanceOf(ApiResponse);
      expect(res.locals.apiResponse.statusCode).toBe(HttpStatusCode.OK);
      expect(mockModels.ScanResult).toBeCalled();
    });
  });

  test('it should return error if  repo name is not given.', (done) => {
    const req = {
      body: {
        repositoryName: '',
      },
    };
    const res = {
      locals: {},
    };
    addToQueue.middleware(req, res, (err) => {
      expect(err).toBeTruthy();
      expect(res.locals.apiResponse).toBe(undefined);
      done();
    });
  });
});
