const config = require('config');
const { createApp } = require('./src/app/app.js');

createApp()
  .then((app) => {
    app.listen(config.get('env.port'));
  });
