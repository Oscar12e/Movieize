let ball;


function setup() {
	createCanvas(windowWidth, windowHeight);
	loadJSON("data.json", drawData);
}

function drawData(data){
	
}


// Runs repeatedly until exit() is called.
function draw() { 
  background(100);
  ball = new Bubble(mouseX, mouseY, 35);
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
	strokeWeight(4);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

  
//}