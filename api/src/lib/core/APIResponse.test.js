const ApiResponse = require('./APIResponse.js');

describe('API Response Test Suite', () => {
  test('it should return results successfully', (done) => {
    const statusCode = 200;
    const data = { propA: 'hello', propB: 'hi' };
    const apiResponse = new ApiResponse(statusCode, data);
    expect(apiResponse).toBeInstanceOf(ApiResponse);
    expect(apiResponse.statusCode).toBe(statusCode);
    expect(apiResponse.data).toBe(data);
    done();
  });
});
