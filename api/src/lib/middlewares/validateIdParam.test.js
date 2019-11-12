const ValidateObjectID = require('./validateIdParam.js');

describe('validate object id middleware¬', () => {
  test('it should not return error if id is valid objectId', async (done) => {
    const req = {
      params: {
        id: '81f485c986a4b666aee10f3a10d306c2',
      },
    };
    const res = {};
    ValidateObjectID.validate(req, res, (err) => {
      expect(err).toBe(undefined);
      done();
    });
  });
  test('it should not return error if id param not present', async (done) => {
    const req = {
      params: {},
    };
    const res = {};
    ValidateObjectID.validate(req, res, (err) => {
      expect(err).toBe(undefined);
      done();
    });
  });

  test('it should return error if param id is not valid objectId', async (done) => {
    const req = {
      params: {
        id: 'asd',
      },
    };
    const res = {};
    ValidateObjectID.validate(req, res, (err) => {
      expect(err).toBeTruthy();
      done();
    });
  });
});
