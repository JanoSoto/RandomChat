module.exports = function (server){

	var socketIO = require('socket.io');
	var webSocket = socketIO.listen(server);

	var usersConectados = [];
	var usersEnEspera = [];

	webSocket.on('connection', function (socket){
		socket.emit('ready');

		socket.on('envio_video', function (stream, username){
			for (i=0; i<usersConectados.length; i++){
				if(usersConectados[i].user1.username == username){
					socket.to(usersConectados[i].user2.id).emit('recibe_video', stream);
					console.log('user1 enviando video al user2');
				}
				else if(usersConectados[i].user2.username == username){
					socket.to(usersConectados[i].user1.id).emit('recibe_video', stream);
					console.log('user2 enviando video al user1');
				}
			}
		});

		socket.on('new_user', function(username){
			user = {
				id: socket.id,
				username: username
			}

			usersEnEspera.push(user);

			if(usersEnEspera.length >= 2){
				
				for(i=0; i<usersEnEspera.length; i++){
					console.log(i+".- "+usersEnEspera[i].username+' - id: '+usersEnEspera[i].id);
				}
				
				var user1 = usersEnEspera.shift();
				var user2 = usersEnEspera.shift();

				usersConectados.push({user1: user1, user2: user2});

				socket.to(user1.id).emit('send_id', user2.id);

			}
			else{
				socket.emit('no_users');	
			}
		});

		socket.on('establece_conexion', function (user){
			console.log('Se establece la conexion.');
			for (i=0; i<usersConectados.length; i++){
				if(usersConectados[i].user2.id == user){
					socket.to(user).emit('conexion_ready', usersConectados[i].user1);
				}
			}
		});

		socket.on('envia_msje', function (msje, username){
			console.log('Largo de la lista: '+usersConectados.length)
			for (i=0; i<usersConectados.length; i++){
				if(usersConectados[i].user1.username == username){
					socket.to(usersConectados[i].user2.id).emit('recibe_msje', msje, username);
					console.log('user1 - mensaje enviado: '+msje+' al usuario '+usersConectados[i].user2.username+' desde el usuario: '+usersConectados[i].user2.username);
				}
				else if(usersConectados[i].user2.username == username){
					socket.to(usersConectados[i].user1.id).emit('recibe_msje', msje, username);
					console.log('user2 - mensaje enviado: '+msje+' al usuario '+usersConectados[i].user1.username+' desde el usuario: '+usersConectados[i].user2.username);
				}
			}
		});

		socket.on('add_room', function(user){
			socket.join(user.id);
			socket.to(user.id).emit('connection_ready', user);
		});

	});

}