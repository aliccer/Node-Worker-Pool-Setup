var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('handled by chuld, pid is ' + process.pid + '\n');
    throw new Error('throw exception');
});

var worker;
process.on('message', function(m, tcp) {
    if (m == 'server') {
        worker = tcp;
	tcp.on('connection', function(socket) {
	    server.emit('connection', socket);
	});
    }
});

process.on('uncaughtException', function(err) {
    // logger.error(err);  //log4j
    process.send({act: 'suicide'});
    worker.close(function() {
        process.exit(1);
    });

    setTimeout(function() {
        process.exit(1);
    }, 5000);
});
