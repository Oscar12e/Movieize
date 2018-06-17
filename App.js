//Proyecto 2 - Movielize
//Óscar Cortés Cordero - 2016136191


//Imports
var cors = require('cors') // para soportar cross domain
var express = require('express'); // servidor web
var bodyParser = require('body-parser'); // para recibir y parsear content en formato json
var fs = require('fs'); //Used to read local readFileSync
var socket = require("socket.io");

console.log("App server is running.");


//Constant values
var PORT_NUMBER = 8000; // constante para definir el puerto a ser usado

//Variables for the server
var app = new express();
var movieData = JSON.parse(fs.readFileSync("data/movies.json", "utf8"));
console.log(movieData[0]["year"]);
var io;

//Sockes

// iniciar el parsing de json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// para habilitar cross domain
app.use(cors())

// publicar contenido estatico que esta en ese folder -- en la raiz
app.use(express.static(__dirname));

app.get('/home', function(request, response){
    response.sendfile('index.html');
});

app.get('/getmoviedata', function(req, res){
    res.send(movieData);
});

app.get('/getMoviesData', function(req, res){
	//var moviesResult = [];
	res.send(movieData);
});


app.get('/getchart', function(req, res) {
	res.send(req.query.temp+' '+ req.query.title+ ' --- Hola mundo');
});



app.post('/savechart', function(req, res) {
	console.log(req.body);
	res.send(req.body.words+ ' --- Hola mundo2');
});


// escuchar comunicacion sobre el puerto indicado en HTTP
var server = app.listen(PORT_NUMBER);
io = socket(server); //Starts the comunication between server and clients

io.sockets.on('connection', newConnection);

function newConnection(pSocket){
  console.log("New conection registered: " + pSocket.id);

}


console.log("Listening on port "+PORT_NUMBER)
