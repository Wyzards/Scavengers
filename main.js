$(document).ready(() => {
	startGame();
	main();
});

function main() {
	$('body').keydown(event => {
		var key = event.which;
		switch(key) {
			case 87: //w
			wDown = true;
			break;
			case 65: //a
			aDown = true;
			break;
			case 83: //s
			sDown = true;
			break;
			case 68: //d
			dDown = true;
			break;
			default:
			console.log("Default");
			break;
		}
	}).keyup(event => {
		var key = event.which;
		switch(key) {
			case 87: //w
			wDown = false;
			break;
			case 65: //a
			aDown = false;
			break;
			case 83: //s
			sDown = false;
			break;
			case 68: //d
			dDown = false;
			break;
			default:
			break;
		}


	});
}

var obstacles = [];
var piece;
var dDown = false;
var wDown = false;
var aDown = false;
var sDown = false;

function startGame() {
	piece = new component(20, 20, 50, 50, 'red');
	obstacles.push(new component(gameArea.canvas.width/2, 100, 800, 200, 'blue'));
	gameArea.start();
}

var gameArea = {
	canvas : document.createElement('canvas'),
	start : function() {
		this.canvas.width = 1500;
		this.canvas.height = 800;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(gameLoop, 20);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function component(x, y, width, height, color) {
	this.x = x;
	this.y = y;
	this.speedX = 0;
	this.speedY = 0;
	this.width = width;
	this.height = height;
	this.update = function() {
		var context = gameArea.context;
		context.fillStyle = color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	
	this.move = function() {
		if(!wDown && !sDown && !aDown && !dDown) {
    	//make y go towards 0
    	if(this.speedY > 0) {
    		this.speedY--;
    	}

    	if(this.speedY < 0) {
    		this.speedY++;
    	}

    	if(this.speedX > 0) {
    		this.speedX--;
    	}

    	if(this.speedX < 0) {
    		this.speedX++;
    	}
    }

    //movement keypresses
    if(wDown) {
    	moveUp(this);
    }

    if(aDown) {
    	moveLeft(this);
    }

    if(sDown) {
    	moveDown(this);
    }

    if(dDown) {
    	moveRight(this);
    }
}



this.newPos = function() {

	var newX = this.x + this.speedX;
	var newY = this.y + this.speedY;
	var rEdge = newX + this.width;
	var bEdge = newY + this.height;

	var canvREdge = gameArea.canvas.width;
	var canvBEdge = gameArea.canvas.height;
		//400

        //if 70 > 400
        if(rEdge > canvREdge) {
			//at every right edge
			newX = canvREdge-this.width;
		}

		if(newX < 0) {
			//at very left edge
			newX = 0;
		}

		if(bEdge > canvBEdge) {
			//at very bottom edge
			newY = canvBEdge-this.height;
		}

		if(newY < 0) {
			//at very top edge
			newY = 0;
		}

		this.x = newX;
		this.y = newY;

	}

	this.setPosBack = function() {
		var newX = this.x - this.speedX;
		var newY = this.y - this.speedY;

		this.x = newX;
		this.y = newY;
	}

	this.checkCollide = function(objs) {
		for(var i = 0; i < objs.length; i++) {
			var mytop = this.y;
			var myleft = this.x;
			var myright = this.x+this.width;
			var mybottom = this.y+this.height;

			var obj = objs[i];

			var othertop = cObj.y;
			var otherleft = cObj.x;
			var otherright = cObj.x+cObj.width;
			var otherbottom = cObj.y+cObj.height;

			var crash = true;
			

			if ((mybottom < othertop) ||
				(mytop > otherbottom) ||
				(myright < otherleft) ||
				(myleft > otherright)) {
				crash = false;
			}

			if(crash === true) {
				if(myright > otherleft) {
					this.x = obj.x-this.width;
				}
			}
	}
}
}

function gameLoop() {
	//drawing
	gameArea.clear();
	piece.move();
	piece.newPos();
	piece.checkCollide(obstacles);
	piece.update();
	for(var i = 0; i < obstacles.length; i++) {
		obstacles[i].update();
	}

}

function moveUp(comp) {
	comp.speedY -= 1;
}

function moveRight(comp) {
	comp.speedX += 1;
}
function moveLeft(comp) {
	comp.speedX -= 1;
}
function moveDown(comp) {
	comp.speedY += 1;
}

function stopMove() {
	piece.speedY = 0;
	piece.speedX = 0;
}
