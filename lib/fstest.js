const fs = require('fs');

const mypath = './tmp';


const ERROR_FILE_NOT_FOUND = 'ENOENT';

//Existing files in path
fs.readdir(mypath, (err, files) => {
    if (err) { console.log('error reading path: ' + err); throw err; }

    files.forEach(file => {
        fs.stat(mypath + '/' + file, (err, stats) => {
            if (err) { console.log('error getting stats for file: ' + err); throw err; }
            if (!stats.isDirectory()) {
                console.log('file detected in path');
                sendFileAndWatch(mypath, file, stats);
            }
        })
    })
});


var sendFileAndWatch = (mypath, file, stats) => {
    let filename = mypath + '/' + file;
    sendFile(filename);
    watchFileChanges(filename);
};


var watchFileChanges = (filename) => {
    console.log('watching file: ' + filename);
    fs.watchFile(filename, { persistent: true, interval: 5007 }, function (cstat, pstat) {

        var delta = cstat.size - pstat.size;
        //File not changed
        if (delta <= 0) return;
        fs.open(filename, 'r', (err, fd) => {
            if (err) { console.log('error opening file: ' + err); throw err; }
            fs.read(fd, new Buffer(delta), 0, delta, pstat.size, function (err, bytes, buffer) {
                console.log('file changed, delta buffer: ' + buffer.toString() + 'size ' + delta + ',' + cstat.size + ',' + pstat.size);
            });
        });
    });
}

var sendFile = (filename) => {
    console.log('send content file: ' + filename);
}


//Watch for new files
//Timeout to aviod duplicate events
var fsTimeout = {};
fs.watch(mypath, { encoding: 'buffer' }, (eventType, file) => {

    let filename = mypath + '/' + file;
    if (file && eventType === 'rename' && !fsTimeout[filename]) {
        fsTimeout[filename] = setTimeout(function () { fsTimeout[filename] = null }, 5000);
        console.log('new file appears' + filename.toString() + ', becaus event = ' + eventType);

        //File deleted
        fs.stat(filename, (err, stats) => {
            if (err && err.code === ERROR_FILE_NOT_FOUND) {
                console.log('unwatching file because it doesn exist');
                fs.unwatchFile(filename);
            } else if (stats.size === 0) {
                console.log('unwatching file because size = 0');
                fs.unwatchFile(filename);
            } else {
                sendFile(filename);
                watchFileChanges(filename);
            }
        });
    }
});