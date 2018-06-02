//Component Variations
class Component {
		constructor(x, y, width, height, collision) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.collision = collision;
			this.speedX = 0;
			this.speedY = 0;
		}

		//Used increase speedX and speedY of 
		move() {

			//if not pressing movement key, slow down to speed 0
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

		    //Increase speed when key is held down
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

		//Used to change grid position of component
		newPos() {
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

			this.x = this.x - xBack;
			this.y = this.y - yBack;
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
					return;					
				}

				var crash = true;

				

				if ((mybottom < othertop) ||
					(mytop > otherbottom) ||
					(myright < otherleft) ||
					(myleft > otherright)) {
					crash = false;
				}

				if(crash === true) {
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
					}
					else if(this.x > otherright) {
						relative = "right";
					}
					else if(this.x+this.width < otherleft) {
						relative = "left";
					}
					else {
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
		//end of component class
	}

	class ImageComp extends Component {
		constructor(x, y, width, height, collision, imageId, hasInteract) {
			super(x, y, width, height, collision);
			this.hasInteract = hasInteract;
			this.imageSrc = imageId
		}

		update() {
			var context = gameArea.context;
			var image = document.getElementById(this.imageSrc);
			context.drawImage(image, this.x, this.y, this.width, this.height);
		}
	}

	class ColorComp extends Component {
		constructor(x, y, width, height, collision, color, hasInteract) {
			super(x, y, width, height, collision);
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
	console.log("javascript still linked");
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

var frontObs = [];
var backObs = [];
var piece;
var dDown = false;
var wDown = false;
var aDown = false;
var sDown = false;

function startGame() {

	piece = new ColorComp(0, 0, 50, 50, true, 'red', false);
	frontObs.push(new ColorComp(gameArea.canvas.width/2, 100, 800, 200, true, 'blue', false));
	frontObs.push(new ColorComp(4250, 100, 100, 700, true, 'green', false));
	backObs.push(new ImageComp(0, 0, 5000, 2000, false, 'background', false));
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

function gameLoop() {
	//drawing
	gameArea.clear();
	piece.move();
	piece.newPos();
	console.log(piece.x + ", " + piece.y);
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
    	frontObs[i].update();
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
