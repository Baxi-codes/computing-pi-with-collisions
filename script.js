/*important functions*/

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
};

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)]
};

function distance(x1, y1, x2, y2) {
	const xDist = x2 - x1
	const yDist = y2 - y1

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
};

/*core variables*/

const canvas = document.getElementById('screen');
const c = canvas.getContext('2d');

const PI = document.getElementById('pi')

canvas.width  = innerWidth;
canvas.height = innerHeight;

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

/*event listeners*/

window.addEventListener('resize', function() {
	canvas.width  = innerWidth;
	canvas.height = innerHeight;
});

/*main code*/

let value_confirmed = false;

const floor = {
	x: 0,
	y: innerHeight*4/5,
	width: innerWidth,
	height: innerHeight/5,
	color: "#fff",
	draw: function () {
		c.fillStyle = this.color;
		c.beginPath();
		c.rect(this.x, this.y, this.width, this.height);
		c.fill();
		c.closePath();
	}
}

let blocks = [];

class Block {
  constructor(x, width, height, m, v, color, id){
		this.x      = x;
		this.height = height;
		this.y      = floor.y - this.height;
		this.width  = width;
		this.m      = m;
		this.v      = v;
		this.color  = color || "white";
		this.id     =id;
	}
	draw() {
		c.fillStyle = this.color;
		c.beginPath();
		c.rect(this.x, this.y, this.width, this.height);
		c.fill();
		c.lineWidth = 3
		c.strokeStyle = "black";
		c.stroke();
		c.closePath();
	}
	update() {
		this.draw();
		this.x += this.v;
		if (this.x < 0) {
			this.v = -this.v;
			count++;
			pi.innerHTML = `${count} × 10<sup>-${massRatio-1}</sup>`
		}
	}
	collided(other){
		if((this.x + this.width > other.x && this.x < other.x + other.width)) {
			return true;
		}
		return false;
	}
	resolveCollision(other) {
		return ((this.m-other.m)/(this.m+other.m))*this.v + ((2*other.m)/(this.m+other.m))*other.v;
	}
}

const block1 = new Block(innerWidth/3, 50, 50, 1, 0, "yellow", 1);
const block2 = new Block((innerWidth*4/5) , 100, 100, 100, -2, "aqua", 2);
let count = 0
let massRatio = block2.m/block1.m;
/*animation loop*/
function screen() {
	c.clearRect(0, 0, innerWidth, innerHeight);
	floor.draw();
	for (var i = 0; i < blocks.length; i++) {
		blocks[i].update();
	}
	if (block1.collided(block2)) {
		const v1 = block1.resolveCollision(block2);
		const v2 = block2.resolveCollision(block1);
		block1.v = v1;
		block2.v = v2;
		count++
		pi.innerHTML = `${count} × 10<sup>-${Math.log10(massRatio)-1}</sup>`
	}
	if (block1.v < block2.v && block1.v > 0 && block2.v > 0) {
		value_confirmed = true
	}
	if (value_confirmed && pi.className !== "confirmed") {
		pi.className = "confirmed";
	}
	if (block1.x <= innerWidth || block2.x <= innerWidth) {
		requestAnimationFrame(screen);
	}
}

/*initialization*/

function init() {
	blocks.push(block1);
	blocks.push(block2);
}

/*finalization*/

init();
screen();
