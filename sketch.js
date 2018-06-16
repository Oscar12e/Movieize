let ball;

function setup() {
	createCanvas(windowWidth, windowHeight);
}


// Runs repeatedly until exit() is called.
function draw() { 
  background(100);
  ball = new Ball(mouseX, mouseY);
  ball.show();
}

// Runs when mouse is clicked.
function mouseClicked() {
	background(500);
	ball.show();
}


// Class and constructor for the ball.

class Ball {

  constructor (initX, initY) {
    this.x = initX;
    this.y = initY;
  }
  
  show() {
	stroke(255);
	strokeWeight(4);
	noFill();
    ellipse(this.x, this.y, 25, 25);
  }
}
  /*function update() {
    
    
  }

  */
//}