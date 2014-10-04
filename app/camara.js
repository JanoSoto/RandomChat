navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

URL = window.URL || window.mozURL || window.webkitURL;

var App = {};

App.camara = function (){
	var video = window.stream;

	navigator.getUserMedia({video: 1}, function (stream){
		video.src = URL.createObjectURL(stream);
		
	}, function (error){
		console.log('Error' + error);
	});
};

App.camara();