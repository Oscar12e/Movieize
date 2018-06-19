//Proyecto 2 - Movielize
//Óscar Cortés Cordero - 2016136191


//Imports
var cors = require('cors')        // para soportar cross domain
var express = require('express'); // servidor web
var bodyParser = require('body-parser'); // para recibir y parsear content en formato json
var fs = require('fs');             //Used to read local readFileSync
var socket = require("socket.io"); //Used to alow communication
var url = require('url');


//Constant values
var PORT_NUMBER = 8000; // constante para definir el puerto a ser usado

//Variables for the server
var app = new express();
var movieJsonList = JSON.parse(fs.readFileSync("data/movies.json", "utf8"));
var io;   //Variable para los sockets
//Movie data holds as a dict

var movieData = {
  "title": {},
  "year" : {},
  "director": {},
  "cast":  {},
  "genre": {}
};

var colorGender = {
	"Comedy": (0,255,0),
	"null": (255,255,255)
}


/**/

/*
|Key| -> values
|Word| -> Index
*/
function storeMovieDataInHash(pCategory, pData){
  var data = String(pData[pCategory]).toLowerCase(); //Se pasa a string para luego poder aplixar toLowerCase y
  for (var substring of data.split(' ')){
    if ( !(substring in movieData[pCategory]) )
      movieData[pCategory][substring] = [];
    movieData[pCategory][substring].push(movieIndex);
  }
}

function loadMovieDataInHash(pCategory, pSearch){
  var search = String(pSearch[pCategory]).toLowerCase(); //Se pasa a string para luego poder aplixar toLowerCase y
  var coincidencesFound = [];

  for (var substring of search.split(' ')){
    if ( (substring in movieData[pCategory]) ) //Si se encuentra el substring dentro de la categoria, se
      coincidencesFound.push(movieData[pCategory][substring]);
  }

  return coincidencesFound;
}

function loadMovieDataInHash_Year(pSearch){
  var searchBegin = pSearch["yearBegin"];
  var searchEnd = pSearch["yearEnd"];
  var coincidencesFound = [];

  if (!((searchBegin == NaN || searchBegin == null) && (searchEnd == NaN || searchEnd == null)))
    for (var currentYear = searchBegin; currentYear <= searchEnd; currentYear++){
      var currentKey = String(currentYear);
      if ( (currentKey in movieData["year"]) ) //Si se encuentra el substring dentro de la categoria, se
        coincidencesFound.push(movieData["year"][currentKey]);
    }

  return coincidencesFound;
}



//Dinosaurio que permitira que la busqueda de datos sea nucho más llevadera
/**
  Se encarga de leer el JSON para poder hacer busquedas más facilmente.
  Se usa movieIndex para contar cada una de las peliculas, ya que solo de esta
  di para obtener el index de cada pelicula.
*/
var movieIndex = 0;
function parseMovieData(pMovie){
  storeMovieDataInHash("title", pMovie);
  storeMovieDataInHash("year", pMovie);
  storeMovieDataInHash("director", pMovie);
  storeMovieDataInHash("cast", pMovie);
  storeMovieDataInHash("genre", pMovie);

  if (movieIndex < 5){
    console.log(String(pMovie["title"]));
    console.log(String(pMovie["year"]));
    pMovie["director"];
    pMovie["cast"];
    pMovie["genre"];
    console.log(movieData);
  }

  movieIndex++;
}

/*
*/
function shortestListIndexInMatrix(pMatrix){
  console.log(pMatrix.length);
  var shortesListIndex = 0;

  for (var listIndex = 1;  listIndex < pMatrix.length; listIndex++){
    if (pMatrix[listIndex].length < pMatrix[shortesListIndex].length)
      shortesListIndex = listIndex;
  }

  return shortesListIndex;
}


/*Naive function that counts how many times an element in a list appaer on the
whole matrix
*/
function listElementsOcurrenceInMatrix(pMatrix, pListIndex){ //Dinosaur preprocess
  var occurencesHash = {};
  var shortesList = pMatrix[pListIndex];
  var elementOccurrences = 0;

  for (var elementIndex = 0; elementIndex < shortesList.length; elementIndex++){
    var element =  shortesList[elementIndex];
    //var key = String(element);

    // = 1; //Inicia en uno pues esta en la lista que toma
    elementOccurrences = 1;
    for(var listIndex = 0; listIndex < pMatrix.length; listIndex++){


      if (listIndex == pListIndex)
        continue;
      if (binarySearch(pMatrix[listIndex], element) != -1)
        elementOccurrences++;
    }

    var key = String(elementOccurrences);

    if (!(key in occurencesHash))
      occurencesHash[key] = [];

    occurencesHash[key].push(element);

  }
  return occurencesHash;

}


function binarySearch(pList, pValue) {
    var half = Math.floor(pList.length / 2);

    if (pList[half] === pValue) {
        return pList[half];
    } else if (pList[half] < pValue && pList.length > 1) {
        return binarySearch(pList.slice(half, Number.MAX_VALUE), pValue);
    } else if (pList[half] > pValue && pList.length > 1) {
        return binarySearch(pList.slice(0, half), pValue);
    } else {

        return -1;
    }
}

/*
  Function returns the element that has 'intersecAmount' intersections in the matrix.
*/
function getElementIntersecInList(intersectHash, intersecAmount){
  return intersectHash[intersecAmount];
}


function sortMoviesToDraw(pIndexList){
	sortedMovies = {};

  for (var movieIndex in pIndexList)
    console.log(movieIndex);
/*
	for (var movie of showingData){
		if (!(movie.year in sortedMovies))					//Si el año de la pelicula no esta ingresado, se agrega
			sortedMovies[movie.year] = {};
		if (!(movie.gender in sortedMovies[movie.year])) 	//Si la categoria de la pelicula no esta en el año
			sortedMovies[movie.year][movie.gender] = [];

		sortedMovies[movie.year][movie.gender].push(movie);
	}
*/
	return sortedMovies;
}

//Final de las funciones

movieJsonList.forEach(parseMovieData); //Se filtran los datos para obtener quienes


// iniciar el parsing de json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// para habilitar cross domain
app.use(cors())

// publicar contenido estatico que esta en ese folder -- en la raiz
app.use(express.static(__dirname));


app.post("/search", getMoviesData);

function testFuction(request, response){
  console.log(request.body);
  response.json(request.body);

  //response.send(data);
}

function getMoviesData (request, response){
   //se recibe la información dentro del body
  var data = request.body[0]; //Se toma el indice 0 pues solo se pasa un argumento, que queda en dicho indice
  console.log(request.body);
  var searchResults = [];           //A matrix that stores all the results found

  searchResults = loadMovieDataInHash("title", data).concat(loadMovieDataInHash_Year(data),
    loadMovieDataInHash("director", data), loadMovieDataInHash("cast", data), loadMovieDataInHash("genre", data));

  if (searchResults.length == 0){
    return;
  }

  var criteriaAmount =  String(searchResults.length);

  var occurencesHash = listElementsOcurrenceInMatrix(searchResults, shortestListIndexInMatrix(searchResults));
  var listIntersectResults = getElementIntersecInList(occurencesHash, criteriaAmount);
  console.log(listIntersectResults);

  response.json(occurencesHash);
  //pSocket.emit('drawBubbles', listIntersectResults);
}


/* Codigo de la plantila que no se usa en ese momento
app.get('/getchart', function(req, res) {
	res.send(req.query.temp+' '+ req.query.title+ ' --- Hola mundo');
});

app.post('/savechart', function(req, res) {
	console.log(req.body);
	res.send(req.body.words+ ' --- Hola mundo2');
});
*/

app.get('/home', function(request, response){
    response.sendfile('index.html');
});


// escuchar comunicacion sobre el puerto indicado en HTTP
var server = app.listen(PORT_NUMBER);
io = socket(server); //Starts the comunication between server and clients

io.sockets.on('connection', newConnection);


function newConnection(pSocket){
  console.log("New conection registered: " + pSocket.id);

  pSocket.on('searchMovies', getMoviesData);

  /* Tres funciones para obtner los datos de filtrado */
  function getMoviesData (data){      //se recibe la información y se pasa como parametro a la funcion
    var searchResults = [];           //A matrix that stores all the results found

    searchResults = loadMovieDataInHash("title", data).concat(loadMovieDataInHash_Year(data),
      loadMovieDataInHash("director", data), loadMovieDataInHash("cast", data), loadMovieDataInHash("genre", data));

    if (searchResults.length == 0){
      return;
    }

    var criteriaAmount =  String(searchResults.length);

    var occurencesHash = listElementsOcurrenceInMatrix(searchResults, shortestListIndexInMatrix(searchResults));
    var listIntersectResults = getElementIntersecInList(occurencesHash, criteriaAmount);
    console.log(listIntersectResults);
    pSocket.emit('drawBubbles', listIntersectResults);
  }

}


console.log("Listening on port "+PORT_NUMBER)
console.log("App server is running.");
console.log(movieJsonList[18637])
