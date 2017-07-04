const fs = require('fs');
const app = require('../../lib/app');
const ERROR_FILE_NOT_FOUND = 'ENOENT';
const config = require('../../config/env').fsreader;
const linedao = require('../../lib/dao/linedao')();
const stream = require('stream');
const readline = require('readline');



module.exports = {
    readAndWatchExistingFiles: readAndWatchExistingFiles,
    readAndWatchDirEvents: readAndWatchDirEvents
};


//Loop over existing files in directory, send content and watch them for updates
function readAndWatchExistingFiles() {
    //Existing files in path
    fs.readdir(config.path, (err, files) => {
        if (err) {
            app.logger.log('error', 'error reading path, check config: ' + err);
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
                    app.logger.log('debug', 'file detected in path');
                    sendFile(fullfilepath);
                    watchFileChanges(fullfilepath);
                }
            })
        })
    });

};


//Watch for file changes into the directory, if the size changed then read
function watchFileChanges(filename) {
    app.logger.log('watching file: ' + filename);
    fs.watchFile(filename, { persistent: true, interval: 5007 }, function (cstat, pstat) {
        var delta = cstat.size - pstat.size;
        //File changed
        if (delta <= 0) return;
            sendFile(filename,pstat.size);
    });
}


//Watch for new files
//Timeout to aviod duplicate events
var fsTimeout = {};
function readAndWatchDirEvents() {
    fs.watch(config.path, { encoding: 'buffer' }, (eventType, file) => {

        let filename = config.path + '/' + file;
        if (file && eventType === 'rename' && !fsTimeout[filename]) {
            fsTimeout[filename] = setTimeout(function () { fsTimeout[filename] = null }, 5000);
            app.logger.log('debug', 'new file appears' + filename.toString() + ', because event = ' + eventType);

            //File deleted
            fs.stat(filename, (err, stats) => {
                if (err && err.code === ERROR_FILE_NOT_FOUND) {
                    app.logger.log('debug', 'unwatching file because it doesn exist');
                    fs.unwatchFile(filename);
                } else if (stats.size === 0) {
                    app.logger.log('debug', 'unwatching file because size = 0');
                    fs.unwatchFile(filename);
                } else {
                    sendFile(filename);
                    watchFileChanges(filename);
                }
            });
        }
    });

};


//Send lines of a log file to kafka via stream, instead of reading it all into memory.
//If position is not undefinded, send only from position to end.
var sendFile = (filename,position) => {

    var instream = position ? fs.createReadStream(filename,{start:position}) : fs.createReadStream(filename);
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    rl.on('line', function (line) {
        linedao.insert(line).then(() => {
            app.logger.log('debug', 'line sended to kafka: ' + line);
        }).catch((err) => {
            app.logger.log('error', 'Error sending line to kafka: ' + err);
        });
    });
}

