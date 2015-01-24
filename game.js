"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
    "images": {
	"runman-idle": "img/runman.png",
	"plane-idle": "img/plane.png"
    },
    "sounds": {
    },
    "fonts": {
    },
    "animations": {
    }
};

var game = new Splat.Game(canvas, manifest);

function generatePositions(canvas, player){
    
    var laneWidth = 2*player.width;

    var centerLane = canvas.width/2 - player.width/2;
    var renderDistance = canvas.height*(7/8);

    player.x = centerLane;
    player.y = renderDistance;

    return {
        lanes: [
            centerLane + laneWidth,
            centerLane,
            centerLane - laneWidth
        ],

        leftBound: canvas.width/2 - canvas.width*0.2 + laneWidth,
        rightBound: canvas.width/2 + canvas.width*0.2 - laneWidth,
        renderDistance: renderDistance,
        obstacleStart: function() { return player.y - renderDistance; }

    };
}

function spawnObstacle(positions){
	var o =new Splat.Entity(positions.lanes[randomNumber(3)],
                            positions.obstacleStart(), 40, 40);
	o.color = "#00ff00";
    return o;
}

function randomNumber(max) {
    return Math.floor((Math.random() * max));
}

function centerText(context, text, offsetX, offsetY) {
    var w = context.measureText(text).width;
    var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
    var y = offsetY | 0;
    context.fillText(text, x, y);
}
function drawEntity(context, drawable){ 
    context.fillStyle = drawable.color;
    context.fillRect(drawable.x, drawable.y, drawable.width, drawable.height);
}
/**
*	Create a line between two points that the entity moves along 
*@param {@link Entity} myEntity The entity that i being moved
*@param {number} x The ending X-coordinate
*@param {number} y The ending Y-coordinate
*@param {number} s The speed at which the entity moves
**/
function createMovementLine(myEntity, x, y, s){
	var startX = myEntity.x;
	var startY = myEntity.y;
	var endX = x - (myEntity.width/2);
	var endY = y - (myEntity.height/2);
	var mySpeed = s;
	//var errMargin =5;

	/**
	* adjust the velocity of the entity in the x direction
	**/
	if(endX > (startX -myEntity.width/2 ))
	{
		myEntity.vx = mySpeed;
		
	}
	else if (endX < (startX -myEntity.width/2))
	{
		myEntity.vx = -mySpeed;
		
	}
	else 
	{
		myEntity.vx = 0;
	}

	/**
	* adjust the velocity of the entity in the x direction
	**/
	if(endY > (startY -myEntity.height/2))
	{
		myEntity.vy = mySpeed;
	}
	else if (endY < (startY -myEntity.height/2))
	{
		myEntity.vy = -mySpeed;
	}
	else
	{
		myEntity.vy = 0;
	}

}

game.scenes.add("title", new Splat.Scene(canvas, function() {
    // initialization
}, function() {
    // simulation
    if(game.keyboard.consumePressed("space")){
	game.scenes.switchTo("main");
    }
}, function(context) {
    // draw
    context.fillStyle = "#092227";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#fff";
    context.font = "25px helvetica";
    centerText(context, "Press Space to Begin", 0, canvas.height / 2 - 13);
}));

game.scenes.add("main", new Splat.Scene(canvas, function() {

	var playerImage = game.images.get("runman-idle");


    this.player = new Splat.AnimatedEntity(canvas.width/2 - 25,canvas.height*(7/8),playerImage.width,playerImage.height,playerImage,0,0); 

    this.camera = new Splat.EntityBoxCamera(this.player,
                                            canvas.width, canvas.height*(1/8),
                                            canvas.width/2, canvas.height*(15/16));


    this.positions = generatePositions(canvas, this.player);

    this.player.color = "red";
    this.player.vy = -1;

    this.obstacles = [ spawnObstacle(this.positions) ];

    // this.player = new Splat.AnimatedEntity(Positions.lanes[1],Positions.playerStart,
    //                                        playerImage.width,playerImage.height,playerImage,0,0);
}, function(elapsedMs) {
    this.player.move(elapsedMs);
    
    //possibly change controls ( tb discussed)
    if((game.keyboard.consumePressed("left") || game.keyboard.consumePressed("a")) &&
       this.player.x > this.positions.leftBound){
	this.player.x -= 150;
    }

    if((game.keyboard.consumePressed("right") || game.keyboard.consumePressed("d")) &&
       this.player.x < this.positions.rightBound){
	this.player.x += 150;
    }

    if(game.keyboard.consumePressed("o")) {
        this.obstacles.push(spawnObstacle(this.positions));
    }

}, function(context) {
    // draw
    context.fillStyle = "#ffffff";
    context.fillRect(canvas.width/2 - canvas.width*0.2, this.player.y - this.positions.renderDistance,
                     canvas.width*0.4, canvas.height);

    this.player.draw(context);
    context.fillstyle = "#00ff00";
    for(var i = 0; i < this.obstacles.length; i++) {
        drawEntity(context, this.obstacles[i]);
    }

}));

game.scenes.add("plane", new Splat.Scene(canvas, function() {
	// initialization
	var playerImage = game.images.get("plane-idle");
	this.player = new Splat.AnimatedEntity(canvas.width/2 - playerImage.width/2,canvas.height/2 -playerImage.height/2,playerImage.width,playerImage.height,playerImage,0,0);
	this.player.color = "blue";	
	this.player.vx = 0;
	this.player.vy = 0;

	this.moveX = this.player.x;
	this.moveY = this.player.y;
	this.moveTo = false;
	this.playerV = 2;
}, function(elapsedMillis) {
	// simulation
	//possibly change controls ( tb discussed)
	//move left
	if((game.keyboard.consumePressed("left") || game.keyboard.consumePressed("a")) && this.player.x >canvas.width/2 - canvas.width*0.4 + 150 && !this.moveTo){
		this.moveX = this.player.x -300;
		this.moveTo = true;
	}
	//move right
	if((game.keyboard.consumePressed("right") || game.keyboard.consumePressed("d")) && this.player.x < canvas.width/2 + canvas.width*0.4 - 150 && !this.moveTo){
		this.moveX = this.player.x + 300;
		this.moveTo = true;
	}
	//move up
	
	if((game.keyboard.consumePressed("up") || game.keyboard.consumePressed("w")) && this.player.y > canvas.height/2 - canvas.height*0.2 + 120 && !this.moveTo){
		this.moveY = this.player.y - 150;
		this.moveTo = true;
	}
	//move down
	if((game.keyboard.consumePressed("down") || game.keyboard.consumePressed("s")) && this.player.y < canvas.height/2 + canvas.height*0.2 - 120 && !this.moveTo){
		this.moveY = this.player.y + 150;
		this.moveTo = true;
	}
	if(this.player.x !== this.moveX || this.player.y !== this.moveY){
		createMovementLine(this.player,this.moveX,this.moveY,this.playerV);
		//console.log(this.player.x, this.moveX,this.player.y,this.moveY );
	}else{
		this.player.vx = 0;
		this.player.vy = 0;
		this.moveTo = false;
		
	}
	this.player.move(elapsedMillis);

}, function(context) {
    // draw
    context.fillStyle = "#ffffff";
    context.fillRect(0, canvas.height/2 - canvas.height*0.2, canvas.width, canvas.height*0.4);

    this.player.draw(context);
}));

game.scenes.switchTo("loading");
