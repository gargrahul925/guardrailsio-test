const ScanResult = jest.fn();

const save = jest.fn();

save.mockImplementation(() => ({
  toJSON: jest.fn(),
}));
ScanResult.mockImplementation(() => ({
  save,
}));

ScanResult.findById = jest.fn();

ScanResult.find = jest.fn();

module.exports = {
  ScanResult,
};
