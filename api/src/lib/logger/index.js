const bunyan = require('bunyan');
const path = require('path');

module.exports = bunyan.createLogger({
  name: 'APP',
  streams: [{
    type: 'rotating-file',
    path: path.join(__dirname, './../../../app.log'),
    period: '1d',
    count: 3,
    src: true,
    serializers: { err: bunyan.stdSerializers.err },
  },
  ],
});
