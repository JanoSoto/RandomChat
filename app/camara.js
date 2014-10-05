navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

URL = window.URL || window.mozURL || window.webkitURL;

var App = {};

App.camara = function (){
	var video = window.streamLocal;

	navigator.getUserMedia({video: true, audio: true}, function (stream){
		video.src = URL.createObjectURL(stream);
		App.socket.emit('video', video);
	}, function (error){
		console.log('Error: ' + error);
	});
};

App.socket = io.connect('/');

App.socket.on('ready', function (){
	msge.textContent = "WebSockets estan listos";
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
			document.querySelector("#chat").className = "";
			App.socket.emit('new_user', username);
		}
	}
}

registraUsuario();
//App.camara();