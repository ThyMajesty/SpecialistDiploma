let argument = process.env.NODE_ENV && process.env.NODE_ENV.trim();

switch (argument) {
    case 'prod':
    case 'production':
        module.exports = require('./config/webpack.prod');
        break;
    case 'static':
        module.exports = require('./config/webpack.build-static');
        break;
    case 'dev':
    case 'development':
    default:
        module.exports = require('./config/webpack.dev');
}


