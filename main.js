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
	piece = new component(0, 0, 50, 50, 'red');
	obstacles.push(new component(gameArea.canvas.width/2, 100, 800, 200, 'blue'));
	obstacles.push(new component(4250, 100, 100, 700, 'green'));
	gameArea.start();
}

var gameArea = {
	canvas : document.createElement('canvas'),
	start : function() {
		this.worldW = 5000;
		this.worldH = 5000;
		this.canvas.width = 1500;
		this.canvas.height = 800;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(gameLoop, 20);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.worldW, this.worldH);
	},
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

	var REdge = gameArea.worldW;
	var BEdge = gameArea.worldH;
		//400

        //if 70 > 400
        if(rEdge > REdge) {
			//at every right edge
			newX = REdge-this.width;
		}

		if(newX < 0) {
			//at very left edge
			newX = 0;
		}

		if(bEdge > BEdge) {
			//at very bottom edge
			newY = BEdge-this.height;
		}

		if(newY < 0) {
			//at very top edge
			newY = 0;
		}

		this.x = newX;
		this.y = newY;

	}

	this.prevPos = function(xBack, yBack) {
		if(this.speedX > 0) {
			//positive x speed
		} else if(this.speedX === 0) {
			//no speed x
			xBack = 0;
		} else {
			//neg speed x
			xBack = xBack*(-1);
		}

		if(this.speedY > 0) {
			//positive y speed
		} else if(this.speedY === 0) {
			//no speed y
			yBack = 0;
		} else {
			//neg speed y
			yBack = yBack*(-1);
		}

		console.log("YBack: " + yBack + " XBack: " + xBack);
		this.x = this.x - xBack;
		this.y = this.y - yBack;
	}

	this.checkCollide = function(objs) {
		for(var i = 0; i < objs.length; i++) {
			var mytop = this.y;
			var myleft = this.x;
			var myright = this.x+this.width;
			var mybottom = this.y+this.height;

			var obj = objs[i];

			var othertop = obj.y;
			var otherleft = obj.x;
			var otherright = obj.x+obj.width;
			var otherbottom = obj.y+obj.height;

			var crash = true;
			

			if ((mybottom < othertop) ||
				(mytop > otherbottom) ||
				(myright < otherleft) ||
				(myleft > otherright)) {
				crash = false;
		}

		if(crash === true) {
				//undo by 1 pixel until isnt colliding and use position to determine if above, to right, to bottom or left
				console.log("Speed X: " + this.speedX + " Speed Y: " + this.speedY);
				var wasntCrash = false;
				while(wasntCrash === false) {
					this.prevPos(1, 1);

					if ((this.y+this.height < othertop) ||
						(this.y > otherbottom) ||
						(this.x+this.width < otherleft) ||
						(this.x > otherright)) {
						wasntCrash = true;
				}
			}

			var relative;


			if(this.y > otherbottom) {
				relative = "below";
			} 
			else if(this.y+this.height < othertop) {
				relative = "above";
					//getting teleported to the bottom when touches top before "above" can register
				}
				else if(this.x > otherright) {
					relative = "right";
				} else if(this.x+this.width < otherleft) {
					relative = "left";
				} else {
					relative = "null";
				}

				console.log("Relative: " + relative);
				switch(relative) {
					case "above": this.y = othertop-this.height-1;
					this.speedY = 0;
					break;
					case "below": this.y = otherbottom+1;
					this.speedY = 0;
					break;
					case "left": this.x = otherleft-this.width-1;
					this.speedX = 0;
					break;
					case "right": this.x = otherright+1;
					this.speedX = 0;
					break;
					default: break;
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
	console.log(piece.x + ", " + piece.y);
	piece.checkCollide(obstacles);

	var translatedX;
	var translatedY;

	if(piece.x <= gameArea.canvas.width/2) {
		translatedX = 0;
		//if 4200 >= 5000-50-(1500/2)
		//if 4200 >= 4950 - (750)
		//if 4200 >= 4200
	} else if (piece.x >= gameArea.worldW-(gameArea.canvas.width/2)) {
		//this x val doesnt work and causes error?
		translatedX = gameArea.worldW-gameArea.canvas.width;
		//can go 100 past world barrier?
	} else {
		translatedX = piece.x-(gameArea.canvas.width/2);
	}

	if(piece.y <= gameArea.canvas.height/2) {
		translatedY = 0;
	} else if(piece.y >= gameArea.worldH-(gameArea.canvas.height/2)) {
	    translatedY = gameArea.worldH-gameArea.canvas.height;
	} else {
		translatedY = piece.y-(gameArea.canvas.height/2);
	}

    // original: gameArea.context.translate(0-(piece.x-(gameArea.canvas.width/2)), 0-(piece.y-(gameArea.canvas.height/2)));
    gameArea.context.translate(0 - translatedX, 0-translatedY);
    piece.update();
    for(var i = 0; i < obstacles.length; i++) {
    	obstacles[i].update();
    }


    gameArea.context.translate(translatedX, translatedY);

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
