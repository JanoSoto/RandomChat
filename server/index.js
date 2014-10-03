var http = require('http');
var express = require('express');

var server = express();

server.use(express.static(__dirname + '/../app'));

http.createServer(server).listen(3000, function (){
	console.log('Servidor listo en puerto %d', this.address().port);
})