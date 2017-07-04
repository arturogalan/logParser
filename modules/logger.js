const winston = require('winston');
const config = require('../config/env').winston;

module.exports = {
    configureLogger: configureLogger
};

function configureLogger() {
    winston.configure({
        level: config.level,
        transports: [
            new (winston.transports.Console)
            // new (winston.transports.File)({ filename: config.fileName })
        ]
    });
    return winston;
}