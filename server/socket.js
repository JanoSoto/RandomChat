module.exports = function (server){

	var socketIO = require('socket.io');
	var webSocket = socketIO.listen(server);

	var usersConectados = [];
	var usersEnEspera = [];

	//var io = require('socket.io').listen(server);

	webSocket.on('connection', function (socket){
	//io.sockets.on('connection', function (socket){
		socket.emit('ready');

		/*
		socket.on('video', function (video){
				
		});
		*/

		socket.on('new_user', function(username, video_src){
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

				//socket.join(user1.id)

				usersConectados.push({user1: user1, user2: user2});

				socket.to(user1.id).emit('send_id', user2.id, video_src);
				//socket.to(user2.id).emit('send_id', user1.id, video_src);

			}
			else{
				socket.emit('no_users');	
			}
		});

		socket.on('establece_conexion', function (user, video){
			console.log('Se establece la conexion.');
			for (i=0; i<usersConectados.length; i++){
				if(usersConectados[i].user2.id == user){
					socket.to(user).emit('conexion_ready', usersConectados[i].user1, video);
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