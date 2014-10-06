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
		App.socket.emit('envio_video', urlVideoLocal, document.getElementById("username").value);
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

App.socket.on('send_id', function (user){
	console.log('soy '+ document.getElementById("username").value + ' y llega el id '+user);
	App.socket.emit('establece_conexion', user);
});

App.socket.on('conexion_ready', function (user){
	console.log('soy '+ document.getElementById("username").value + ' y llega el id '+user.id);
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

App.socket.on('recibe_video', function (stream){
	videoRemoto.src = stream;
	//console.log('Stream de datos?: '+stream);
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
			App.socket.emit('new_user', username);
			App.camara();
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
		document.querySelector('#escritura').focus();
	}
}

