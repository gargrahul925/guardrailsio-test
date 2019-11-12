const bunyan = jest.fn();
bunyan.mockImplementation(() => ({
    use: jest.fn(),
    get: jest.fn(),
    listen: jest.fn(),
}));

module.exports = bunyan;
