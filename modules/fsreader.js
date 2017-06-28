const fs = require('fs');
var app = require('../lib/app');
const ERROR_FILE_NOT_FOUND = 'ENOENT';

module.exports = {
    readAndWatchExistingFiles: readAndWatchExistingFiles,
    readAndWatchDirEvents: readAndWatchDirEvents
};


//Loop over existing files in directory, send content and watch them for updates
function readAndWatchExistingFiles(config) {
    //Existing files in path
    fs.readdir(config.path, (err, files) => {
        if (err) {
            app.logger.log('error','error reading path, check config: ' + err);
            throw err;
        }

        files.forEach(file => {
            let fullfilepath = config.path + '/' + file;
            fs.stat(fullfilepath, (err, stats) => {
                if (err) { 
                    app.logger.log('error', 'error getting stats for file: ' + err); 
                    throw err; 
                }
                if (!stats.isDirectory()) {
                    app.logger.log('debug','file detected in path');
                    sendFile(fullfilepath);
                    watchFileChanges(fullfilepath);
                }
            })
        })
    });

};


//Watch for file changes into the directory, if the size changed then read
function watchFileChanges (filename){
    app.logger.log('watching file: ' + filename);
    fs.watchFile(filename, { persistent: true, interval: 5007 }, function (cstat, pstat) {

        var delta = cstat.size - pstat.size;
        //File not changed
        if (delta <= 0) return;
        fs.open(filename, 'r', (err, fd) => {
            if (err) { app.logger.log('error','error opening file: ' + err); throw err; }
            fs.read(fd, new Buffer(delta), 0, delta, pstat.size, function (err, bytes, buffer) {
                app.logger.log('debug','file changed, delta buffer: ' + buffer.toString() + 'size ' + delta + ',' + cstat.size + ',' + pstat.size);
            });
        });
    });
}


//Watch for new files
//Timeout to aviod duplicate events
var fsTimeout = {};
function readAndWatchDirEvents(config, logger) {
    fs.watch(config.path, { encoding: 'buffer' }, (eventType, file) => {

        let filename = config.path + '/' + file;
        if (file && eventType === 'rename' && !fsTimeout[filename]) {
            fsTimeout[filename] = setTimeout(function () { fsTimeout[filename] = null }, 5000);
            app.logger.log('debug','new file appears' + filename.toString() + ', because event = ' + eventType);

            //File deleted
            fs.stat(filename, (err, stats) => {
                if (err && err.code === ERROR_FILE_NOT_FOUND) {
                    app.logger.log('debug','unwatching file because it doesn exist');
                    fs.unwatchFile(filename);
                } else if (stats.size === 0) {
                    app.logger.log('debug','unwatching file because size = 0');
                    fs.unwatchFile(filename);
                } else {
                    sendFile(filename);
                    watchFileChanges(filename);
                }
            });
        }
    });

};


var sendFile = (filename) => {
    app.logger.log('debug','send content file: ' + filename);
}

