var http = require("http");

var operator = function(solicitud, respuesta){
	console.log("Nueva peticion");
	respuesta.end("Hola Mundo");
	
};

var servidor = http.createServer(operator)

servidor.listen(8080);