const winston = require('winston');

module.exports = {
    configureLogger: configureLogger
};

function configureLogger(config) {
    winston.configure({
        level: config.level,
        transports: [
            new (winston.transports.File)({ filename: config.fileName })
        ]
    });
    return winston;
}