//Component Variations
class Component {
		constructor(x, y, width, height, collision, moves) {
			this.x = x;
			this.y = y;
			this.colX = x;
			this.colY = y;
			this.width = width;
			this.height = height;
			this.collision = collision;
			this.speedX = 0;
			this.speedY = 0;
			this.gravity = 0.5;
			this.moves = moves;
		}

		//Used increase speedX and speedY of 
		move() {

			//if not pressing movement key, slow down to speed 0
			if(!aDown && !dDown ) {
		    	//make y go towards 0
		    	this.speedX = 0;
		    }

		    //Increase speed when key is held down
		    if(aDown) {
		    	moveLeft(this);
		    }

		    if(dDown) {
		    	moveRight(this);
		    }

		    $('body').keypress(event => {
		    	var key = event.which;
		    	if(key === 119) {
		    		if(this.relative === 'above' || this.y === gameArea.worldH-this.height) {
		    		this.speedY = -25;
		    		}
		    	}
		    });
		}

		//Used to change grid position of component
		newPos() {
			this.speedY += this.gravity;
			var newX = this.x + this.speedX;
			var newY = this.y + this.speedY;

			var rEdge = newX + this.width;
			var bEdge = newY + this.height;

			var REdge = gameArea.worldW;
			var BEdge = gameArea.worldH;
			//400
	        //if 70 > 400
	        if(rEdge > REdge) {
				newX = REdge-this.width;
			}

			if(newX < 0) {
				newX = 0;
			}

			if(bEdge > BEdge) {
				newY = BEdge-this.height;
			}

			if(newY < 0) {
				newY = 0;
			}

			this.x = newX;
			this.y = newY;
			this.colX = this.x;
			this.colY = this.y;

			if(this.y >= gameArea.worldH-this.height) {
				this.y = gameArea.worldH-this.height;
				this.speedY = 0;
			}

			if(this.y <= 0) {
				this.y = 0
				this.speedY = 0;
			}
		}


		//Used to move the component in the opposite direction of its current path by the amount specified
		prevPos(xBack, yBack) {

			//Determining if xBack and yBack should be positive or negative
			if(this.speedX > 0) {
			} 
			else if(this.speedX === 0) {
				xBack = 0;
			} 
			else {
				xBack = xBack*(-1);
			}

			if(this.speedY > 0) {
			} 
			else if(this.speedY === 0) {
				yBack = 0;
			}
			else {
				yBack = yBack*(-1);
			}

			this.colX -= xBack;
			this.colY -= yBack;
		}

		checkCollide(objs) {
			//for every object in array of objects, check if this is colliding with it
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

				if(obj.collision === false) {
					return false;					
				}

				var crash = true;

				

				if ((mybottom <= othertop) ||
					(mytop >= otherbottom) ||
					(myright <= otherleft) ||
					(myleft >= otherright)) {
					crash = false;
				}

				if(crash === true) {
					var wasntCrash = false;
					while(wasntCrash === false) {
						this.prevPos(1, 1);

						if ((this.colY+this.height <= othertop) ||
							(this.colY >= otherbottom) ||
							(this.colX+this.width <= otherleft) ||
							(this.colX >= otherright)) {
							wasntCrash = true;
						}
					}

					var relative;
					if(this.colY >= otherbottom) {
						this.y = otherbottom;
						this.speedY = 0;
						this.relative = "below";
					} 
					else if(this.colY+this.height <= othertop) {
						this.y = othertop-this.height;
						this.speedY = 0;
						this.relative = "above";
					}
					else if(this.colX >= otherright) {
						this.x = otherright;
						this.speedX = 0;
						this.relative = "right";
					}
					else if(this.colX+this.width <= otherleft) {
						this.x = otherleft-this.width;
						this.speedX = 0;
						this.relative = "left";
					}
				}
			}
		}
		//end of component class
	}

	class ImageComp extends Component {
		constructor(x, y, width, height, collision, imageId, hasInteract, moves) {
			super(x, y, width, height, collision, moves);
			this.hasInteract = hasInteract;
			this.imageSrc = imageId
		}

		update() {
			var context = gameArea.context;
			var image = document.getElementById(this.imageSrc);

			if(this.width !== 'null' && this.height !== 'null') {
			context.drawImage(image, this.x, this.y, this.width, this.height);
			}
			else {
			context.drawImage(image, this.x, this.y);
			}
		}
	}

	class ColorComp extends Component {
		constructor(x, y, width, height, collision, color, hasInteract, moves) {
			super(x, y, width, height, collision, moves);
			this.hasInteract = hasInteract;
			this.color = color;
		}

		update() {
			var context = gameArea.context;
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	}

$(document).ready(() => {
	startGame();
	main();
});

function main() {
	$('body').keydown(event => {
		var key = event.which;
		switch(key) {
			case 65: //a
			aDown = true;
			break;
			case 68: //d
			dDown = true;
			break;
			default:
			break;
		}
	}).keyup(event => {
		var key = event.which;
		switch(key) {
			case 65: //a
			aDown = false;
			break;
			case 68: //d
			dDown = false;
			break;
			default:
			break;
		}
	});
}

var frontObs = [];
var backObs = [];
var piece;
var dDown = false;
var wDown = false;
var aDown = false;
var sDown = false;

function startGame() {

	piece = new ColorComp(0, 0, 50, 50, true, 'red', false, true);
	frontObs.push(new ColorComp(gameArea.canvas.width/2, 100, 800, 200, true, 'blue', false, false));
	frontObs.push(new ColorComp(4250, 100, 100, 700, true, 'green', false, false));
	frontObs.push(new ImageComp(3500,2000-521, 200, 150, true, 'cat', false, true));
	backObs.push(new ImageComp(0, 0, 5000, 2000, false, 'background', false, false));
	frontObs.push(new ColorComp(200, 200, 400, 100, true, 'yellow', false, false));
	frontObs.push(new ColorComp(500, 1400,400, 100, true, 'black', false, false
				   ));
	gameArea.start();
}

var gameArea = {
	canvas : document.createElement('canvas'),
	start : function() {
		this.worldW = 5000;
		this.worldH = 2000;
		this.canvas.width = window.innerWidth-25;
		this.canvas.height = window.innerHeight-25;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(gameLoop, 20);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.worldW, this.worldH);
	},
}

function gameLoop() {
	//drawing
	gameArea.clear();
	piece.move();
	piece.newPos();
	piece.relative = "none";
	piece.checkCollide(frontObs);
	piece.checkCollide(backObs);

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
    for(var i = 0; i < backObs.length; i++) {
    	backObs[i].update();
    }
    piece.update();
    for(var i = 0; i < frontObs.length; i++) {
	//if(frontObs[i].moves === true) {
	    frontObs[i].newPos();
	//}
    	frontObs[i].update();
    }


    gameArea.context.translate(translatedX, translatedY);

}

function moveUp(comp) {
	comp.speedY = -2;
}

function moveRight(comp) {
	comp.speedX = 10;
}
function moveLeft(comp) {
	comp.speedX = -10;
}

function stopMove() {
	piece.speedY = 0;
	piece.speedX = 0;
}
