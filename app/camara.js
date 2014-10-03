navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

URL = window.URL || window.mozURL || window.webkitURL;

var App = {};

App.camara = function (){
	var video = window.stream;
	navigator.getUserMedia('audio, video', function(stream){
		video.src = URL.createObjectURL(stream);
		
	})
}