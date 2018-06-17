//Presentation layer - Page
var socket;
let ball; 			//Ball create to de-stress myself
var moviesData;		//Created to stored the json
var showingData; 	//JSON for currently shown data

//UI its a dictonary that holds all the acces to the component to the user interface interaction
var ui = {
	"TextBox": {}
};

//Components use to get the parameters from users
var title, genre, actors, director, yearBegin, yearEnd, buttonSearch;

//Codigos de colores para cada una de las burbujas según su genero
const COLOR_GENDER = {
	"Comedy": (0,255,0),
	"null": (255,255,255)
}

function preload() {
    var url = 'https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json';
    //moviesData = loadJSON(url);
		//loadBytes("https://localhost:8000/getchart", loadMovies);

}

function setup() {
	createCanvas(windowWidth, windowHeight);
	socket = io.connect('http://localhost:8000');

	loadComponents();
	showingData = [];
}


function loadMovies(data){
	//moviesData = bin25String(data["bytes"]);
}

function loadComponents(){
	createElement('p', 'Titulo:').position(20,65);
	title = createInput();
	title.position(80, 80);

	createElement('p', 'Genero:').position(270,65);
	genre = createInput();
	genre.position(330, 80);

	createElement('p', 'Actores:').position(520,65);
	actors = createInput();
	actors.position(580, 80);

	createElement('p', 'Director:').position(770, 65);
	director = createInput();
	director.position(830, 80);

	createElement('p', 'Rango de años:').position(20,95);

	createElement('p', 'Inicio ').position(150,95);
	yearBegin = createInput();
	yearBegin.position(200, 110);

	createElement('p', 'Fin ').position(400,95);
	yearEnd = createInput();
	yearEnd.position(450, 110);

	buttonSearch = createButton('Consultar');
	buttonSearch.position(620, 110);
	buttonSearch.mousePressed(searchData);

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
	var decrypted = CryptoJS.AES.decrypt(encrypted, "pass");
	showingData = decrypted.toString(CryptoJS.enc.Utf8);
	drawBubbles()
}


function searchData(){

	//Una serie de if para recorrer de forma naive los json para obtener las coincidencias, O(n) si tomamos nuestro n como la cantidad de peliculas tho
	for (var movie of jsonMovies){
		if (movie.getString("title") == title.value()){
			jsonData.push(movie);
		} else if (movie.getString("genre")	== genre.value()){
			jsonData.push(movie);
		}
	}

	showingData = [{"title":"After Dark in Central Park","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"Boarding School Girls' Pajama Parade","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"Buffalo Bill's Wild West Parad","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"Caught","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"Clowns Spinning Hats","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"Capture of Boer Battery by British","year":1900,"director":"James H. White","cast":null,"genre":"Short documentary","notes":null},{"title":"The Enchanted Drawing","year":1900,"director":"J. Stuart Blackton","cast":null,"genre":null,"notes":null},{"title":"Family Troubles","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"Feeding Sea Lions","year":1900,"director":null,"cast":"Paul Boyton","genre":null,"notes":null},{"title":"How to Make a Fat Wife Out of Two Lean Ones","year":1900,"director":null,"cast":null,"genre":"Comedy","notes":null},{"title":"New Life Rescue","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"New Morning Bath","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"Searching Ruins on Broadway, Galveston, for Dead Bodies","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"The Tribulations of an Amateur Photographer","year":1900,"director":null,"cast":null,"genre":null,"notes":null},{"title":"Trouble in Hogan's Alley","year":1900,"director":null,"cast":null,"genre":"Comedy","notes":null},{"title":"Two Old Sparks","year":1900,"director":null,"cast":null,"genre":"Short","notes":"Produced by Siegmund Lubin"},{"title":"The Wonder, Ching Ling Foo","year":1900,"director":null,"cast":"Ching Ling Foo","genre":"Short","notes":"Produced by Siegmund Lubin"},{"title":"Watermelon Contest","year":1900,"director":"James H. White","cast":null,"genre":"Short","notes":null}]
	drawBubbles();
}

function drawBubbles(){
	sortedMovies = orderByYears();
}


//Se pasan los datos a una esctructura de diccionario, donde la llave es el año de la pelicula y el contenido una lista de las peliculas
function orderByYearsaAndCategory(){
	sortedMovies = {};

	for (var movie of showingData){
		if (!(movie.year in sortedMovies))					//Si el año de la pelicula no esta ingresado, se agrega
			sortedMovies[movie.year] = {};
		if (!(movie.gender in sortedMovies[movie.year])) 	//Si la categoria de la pelicula no esta en el año
			sortedMovies[movie.year][movie.gender] = [];

		sortedMovies[movie.year][movie.gender].push(movie);
	}

	return sortedMovies;
}


//Se planeaba usar para comparar palabras que fueran similares
function isSimilar(words, oration){
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
