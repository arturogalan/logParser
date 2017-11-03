const fslogger = require('../modules/logger')
const config = require('../config/env');
const app = module.exports;
const readService = require('../lib/service/readerservice');
const async = require('async');
var logger;


module.exports = {
    start: start,
};

function start() {


    async.series([
        configureLogger,
        startFilesServer

    ], done);

    /**
     * Callback function of async series to load all the submodules of the app for if occurs an error show a message.
     *
     * @param err Error for callback
     */
    function done(err) {
        status = err ? "stop" : "running";
        if (err) {
            status = "stop";
            logger.error(path.basename(__filename) + " - done - " + err);
        }
    }

    function startFilesServer(next) {

        readService.readAndWatchExistingFiles.then(() => { 
            try {
                readService.readAndWatchDirEvents();
                next();
            } catch (error) {
                logger ? logger.log('error', 'error in fsreader: ' + error):console.log('error in fsreader: ' + error)
            }
        })

        
    }



    

};

function configureLogger(next) {
    logger = fslogger.configureLogger();
    app.logger = logger;
    logger.log('info', 'Initializing app!');
    next();
}





