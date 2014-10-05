module.exports = function (server){

	var socketIO = require('socket.io');
	var webSocket = socketIO.listen(server);

	var usersConectados = [];
	var usersEnEspera = [];

	function estableceConexion(){
		if(usersEnEspera.length >= 2){
			
		}
	}

	webSocket.on('connection', function (socket){
		socket.emit('ready');
		socket.on('video', function (video){
			
		});

		socket.on('new_user', function(username){
			user = {
				id: socket.id,
				username: username
			}

			usersEnEspera.push(user);
		});

	});

}