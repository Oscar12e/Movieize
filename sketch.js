//Presentation layer - Page

let ball; 			//Ball create to de-stress myself
var moviesData;		//Created to stored the json
var showingData; 	//JSON for currently shown data

//UI its a dictonary that holds all the acces to the component to the user interface interaction
var socket;
var ui = {
	"TextBox": {},
	"Button" : {}
};

//Components use to get the parameters from users
var title, genre, actors, director, yearBegin, yearEnd, buttonSearch;

function setup() {
	createCanvas(windowWidth, windowHeight);
	console.log("Secktch is loaded");

	socket = io.connect('http://localhost:8000');
	socket.on('drawBubbles', drawBubbles);
	loadComponents();
}


function loadMovies(data){
	//moviesData = bin25String(data["bytes"]);
}

//Se puede hacer MUCHO mejor, lo sé, pero el tiempo..
function loadComponents(){
	createElement('p', 'Titulo:').position(20,65);
	ui.TextBox["title"] =  createInput().position(80, 80);

	createElement('p', 'Genero:').position(270,65);
	ui.TextBox["genre"] =  createInput().position(330, 80);


	createElement('p', 'Actores:').position(520,65);
	ui.TextBox["cast"] =  createInput().position(580, 80);

	createElement('p', 'Director:').position(770, 65);
	ui.TextBox["director"] =  createInput().position(830, 80);


	createElement('p', 'Rango de años:').position(20,95);

	createElement('p', 'Inicio ').position(150,95);
	ui.TextBox["yearBegin"] =  createInput().position(200, 110);


	createElement('p', 'Fin ').position(400,95);
	ui.TextBox["yearEnd"] =  createInput().position(450, 110);


	ui.Button["buttonSearch"] = createButton('Consultar').position(620, 110);
	ui.Button["buttonSearch"].mousePressed(searchData);

}



function saveKey(){
	if (showingData != []){
		var encrypted = CryptoJS.AES.encrypt(showingData, "pass");
		//Llamar el server para que guarde el dato encriptado
	} else
		console.log("No se esta mostrando nada en pantalla.");
}

//Recibe el resultado de la busqueda encriptado para luego desenctriptarlo y mostrarlo
function loadKey(encrypted){
	console.log(encrypted);/*
	var decrypted = CryptoJS.AES.decrypt(encrypted, "pass");
	showingData = decrypted.toString(CryptoJS.enc.Utf8);
	*/
}



function searchData(){


	var queryParams = [{
		"title": ui.TextBox["title"].value(),
		"yearBegin" : parseInt(ui.TextBox["yearBegin"].value()),
		"yearEnd" : parseInt(ui.TextBox["yearEnd"].value()),
		"director": ui.TextBox["director"].value(),
		"cast":  ui.TextBox["cast"].value(),
		"genre": ui.TextBox["genre"].value()
	}];

	console.log(queryParams);
	console.log(JSON.stringify(queryParams));

	/*fetch('http://localhost:3000/test', {
	    method: 'POST',
	    body: JSON.stringify(data),
	    headers: {'Content-Type': 'application/json'}
	}).then(response => {
	  return response.json();
	}).then(data => {
	  alert(JSON.stringify(data));
	}).catch(err => {
	    alert(err);
	});*/

	fetch("/search", {
    method: 'POST',
    body: JSON.stringify(queryParams),
    headers: {'Content-Type': 'application/json'}
	}).then(response => {
	  return response.json();
	}).then(queryParams => {
	  alert(JSON.stringify(queryParams));
	}).catch(err => {
	    alert(err);
	});
	//loadJSON("/search/searchData=\""+ JSON.stringify(queryParams) + "\"?", drawBubbles);
	//socket.emit('searchMovies', queryParams);

}

function drawBubbles(movieResult){
	console.log("Inicia");
	console.log(movieResult.msg);
	sortedMovies = orderByYearsaAndCategory();
}


//Se pasan los datos a una esctructura de diccionario, donde la llave es el año de la pelicula y el contenido una lista de las peliculas
function orderByYearsaAndCategory(){
	sortedMovies = {};

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



// Runs repeatedly until exit() is called.
function draw() {
  background(200,200,200);
  ball = new Bubble(mouseX, mouseY, 50); //Usado para mover una burbuja por todo el canvas -- Primer gran logro en este proyecto, en mi opinión personal
  ball.show();
}


// Class and constructor for the ball.

class Bubble {

  constructor (pX, pY, pSize) {
    this.x = pX;
    this.y = pY;
	this.size = pSize;
  }

  show() {
	stroke(255);
    ellipse(this.x, this.y, this.size, this.size);
  }
}
