navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

URL = window.URL || window.mozURL || window.webkitURL;

var App = {};

var idRemoto;

//var urlVideoLocal;
var video = window.streamLocal;
var videoRemoto = window.streamRemoto;

App.camara = function (){
	var urlVideoLocal;
	navigator.getUserMedia({video: true, audio: true}, function (stream, urlVideoLocal){
		urlVideoLocal = URL.createObjectURL(stream);
		video.src = urlVideoLocal;
		//App.socket.emit('video', video);
	}, function (error){
		console.log('Error: ' + error);
	});

	return urlVideoLocal;
};

App.socket = io.connect('/');

App.socket.on('ready', function (){
	msje.textContent = "WebSockets estan listos";
});

App.socket.on('no_users', function (){
	msje.textContent = "No hay mas usuarios conectados, espere a que ingrese alguien más...";
});

App.socket.on('send_id', function (user, video_src){
	console.log('soy '+ document.getElementById("username").value + ' y llega el id '+user+' con video '+video_src);
	App.socket.emit('establece_conexion', user, video_src);
	//videoRemoto.src = video_src;
	//App.socket.to(user_id).emit('video', video);
	//App.socket.join(''+user_id);
	//App.socket.in(user_id).emit('video', video);
	//App.socket.emit('add_room', user);
	//idRemoto = user;
	//io.sockets.socket(user).emit('establece_conexion', )
});

App.socket.on('conexion_ready', function (user, video){
	console.log('soy '+ document.getElementById("username").value + ' y llega el id '+user.id+' con video '+video);
});

App.socket.on('video', function (video){
	videoRemoto = video;
});

App.socket.on('connection_ready', function (user){
	userRemoto.textContent = user.username;
	userLocal.textContent = document.getElementById("username").value;
});

App.socket.on('recibe_msje', function (msje, username){
	console.log('Mensaje recibido: '+msje);
	var etiquetaMsje = document.createElement('p');
	etiquetaMsje.textContent = username + ' dice: ' + msje;
	document.querySelector('#conversacion').appendChild(etiquetaMsje);
});

function registraUsuario(){
	
	var btnSession = document.querySelector("#btnSession").onclick = function (){
		var username = document.getElementById("username").value;
		if (username == ""){
			respuestaUser.textContent = "Debe ingresar un nombre";
		}
		else if(username){
			console.log("Se aprieta el boton");
			document.querySelector("#inicioSesion").className = "hide";
			document.querySelector("#chat").className = "col-md-12";
			//console.log('Enviando src video: '+urlVideoLocal);
			App.socket.emit('new_user', username, App.camara());
		}
	}
}

registraUsuario();

document.querySelector("#enviarMensaje").onclick = function (){
	var username = document.getElementById("username").value;
	var msjeTxt = document.querySelector('#escritura').value;

	if(msjeTxt != ""){
		App.socket.emit('envia_msje', msjeTxt, username);
		escritura.value = "";
		var etiquetaMsje = document.createElement('p');
		etiquetaMsje.textContent = username + ' dice: ' + msjeTxt;
		document.querySelector('#conversacion').appendChild(etiquetaMsje);
	}
}

