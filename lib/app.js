const fslogger = require('../modules/logger')
const config = require('../config/env');
const app = module.exports;
const readService = require('../lib/service/readerservice');
var logger;


module.exports = {
    start: start,
};

function start() {
    try {
        configureLogger();
        readService.readAndWatchExistingFiles();
        readService.readAndWatchDirEvents();
    } catch (error) {
        if (logger)
            logger.log('error', 'error in fsreader: ' + error);
        else
            console.log('error in fsreader: ' + error)
    }

};

function configureLogger() {
    logger = fslogger.configureLogger();
    app.logger = logger;
    logger.log('info', 'Initializing app!');
}





