const defer = require('config/defer').deferConfig;
const p = require('./../package.json');

module.exports = {
    app: {
        name: p.name,
        description: p.description,
    },
    api: {
        ROOT_URI: '',
        BASE_URI: defer(cfg => `${cfg.api.ROOT_URI}/`),
    },
    env: {
        mode: process.env.NODE_ENV,
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
    },
    DB: {
        url: 'mongodb://mongodb:27017/app',
    },
    redis: {
        host: "local_redis",
        port: 6379
    }
};
