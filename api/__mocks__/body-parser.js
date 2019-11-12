const bodyParser = jest.fn();
bodyParser.mockImplementation = {};
bodyParser.json = jest.fn();
bodyParser.json.mockImplementation(() => {});

module.exports = bodyParser;
