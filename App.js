var cors = require('cors') // para soportar cross domain
var express = require('express'); // servidor web
var bodyParser = require('body-parser'); // para recibir y parsear content en formato json

// constante para definir el puerto a ser usado
var PORT_NUMBER = 8000;

// se inicia el servidor web express
var app = express()

// iniciar el parsing de json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// para habilitar cross domain
app.use(cors())

// publicar contenido estatico que esta en ese folder
//app.use(express.static("C:\\Users\\rodri\\OneDrive\\Personales\\Itcr\\SemI2018\\Analisis de Algoritmos\\node"));
app.use(express.static("C:\\MovieStaticData"));


app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status(404);
    next(error);
});


app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


app.get('/getchart', function(req, res) {
	res.send(req.query.temp+' '+ req.query.title+ ' --- Hola mundo');
});


app.post('/savechart', function(req, res) {
	console.log(req.body);
	res.send(req.body.words+ ' --- Hola mundo2');
});


// escuchar comunicacion sobre el puerto indicado en HTTP
app.listen(PORT_NUMBER);
console.log("Listening on port "+PORT_NUMBER)