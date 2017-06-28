const net = require('net');
const fslogger = require('../modules/logger')
var config = require('../config/env/local');
var logger;
var app = module.exports;
const fsreader = require('../modules/fsreader');

// var PIPE_NAME = "mypipe";
// var PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;


module.exports = {
    start: start,
};

function start(config) {
    try {
        logger = fslogger.configureLogger(config.winston);
        app.logger = logger;
        logger.log('info', 'Initializing app!');
        fsreader.readAndWatchExistingFiles(config.fsreader,logger);
        fsreader.readAndWatchDirEvents(config.fsreader,logger);
    } catch (error) {
        console.log('error in fsreader:' + error)
    }

};






