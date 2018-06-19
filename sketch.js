//Presentation layer - Page

let ball; 			//Ball create to de-stress myself
var showingData = {}; 	//JSON for currently shown data

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
	//socket.on('drawBubbles', drawBubbles);

	loadComponents();
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


	ui.Button["buttonSave"] = createButton('Guardar').position(270, 50);
	ui.Button["buttonSave"].mousePressed(saveKey);


	ui.Button["buttonLoad"] = createButton('Cargar').position(580, 50);
	ui.Button["buttonLoad"].mousePressed(loadKey);

	ui.TextBox["key"] =  createInput().position(650, 50);

}



function saveKey(){
	var jsonToSend = [showingData];
	console.log(jsonToSend);

	fetch("/saveBubbles", {
		method: 'POST',
		body: JSON.stringify(jsonToSend),
		headers: {'Content-Type': 'application/json'}
	}).then(response => {
		return response.json();
	}).then(jsonToSend => {
		alert(JSON.stringify(jsonToSend));
	}).catch(err => {
			alert(err);
	});
}


function loadKey(){
	var data = [{
		"key": ui.TextBox["key"].value()
	}];

	fetch("/loadBubbles", {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
	}).then(response => {
	  return response.json();
	}).then(data => {
	  alert(JSON.stringify(data));
	}).catch(err => {
	    alert(err);
	});
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


	fetch("/search", {
    method: 'POST',
    body: JSON.stringify(queryParams),
    headers: {'Content-Type': 'application/json'}
	}).then(response => {
	  return response.json();
	}).then(queryParams => {
	  drawBubbles(JSON.stringify(queryParams));
	}).catch(err => {
	    alert(err);
	});


}

function drawBubbles(movieResult){
	console.log("Inicia");
	console.log(movieResult);
	showingData = JSON.parse(movieResult);
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
