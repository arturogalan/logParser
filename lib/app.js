const net = require('net');

// var PIPE_NAME = "mypipe";
// var PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;


var serverIPC = net.createServer(function(stream) {
        
    stream.on('data', fileStream =>{
        console.log(fileStream);
    });
    
    stream.on('end', ()=>{
        console.log('server ended');
        serverIcp.close();
    });

    stream.write('1366815793 quark garak');
});


// // serverIPC.listen('/Users/arturo.galan/Documents/logtest/logfile.log',()=>{console.log('on listening')})
serverIPC.listen('\\\\.\\pipe\\mypipe',function(){
    console.log('Server: on listening');
})


var client = net.connect('\\\\.\\pipe\\mypipe');


client.on('data',(data)=>{
    console.log('data received:' + data.toString());
    client.end('thanks');
});


client.on('end', function() {
    console.log('Client: on end');
})





