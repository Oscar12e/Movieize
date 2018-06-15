
// Runs on initial load
void setup()
{
	size(500, 500);
	background(100);
}

// Runs repeatedly until exit() is called.
void draw()
{ 

}

// Class and constructor for the ball.
class Ball {
	int x, y;
	int yV;
	int gravity;

	Ball(int initX, int initY) {
		x = initX;
		y = initY;
		yV = 1;
		gravity = 1;
	}
}