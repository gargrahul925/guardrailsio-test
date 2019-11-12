const express = jest.fn();
express.mockImplementation(() => ({
    use: jest.fn(),
    get: jest.fn(),
    listen: jest.fn(),
}));

express.Router = jest.fn();
express.static = jest.fn();
express.Router.mockImplementation(() => ({
    use: jest.fn(),
}));

module.exports = express;
