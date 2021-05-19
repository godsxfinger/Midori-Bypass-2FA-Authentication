var app = require('./app');
var config = require('./config');
var http = require('http');
var server = http.createServer(app);
server.listen(config.port || 80, function() {
    console.log('Server started on *:' + config.port);
});