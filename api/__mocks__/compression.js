const compression = jest.fn();
compression.mockImplementation(() => ({}));
module.exports = compression;
