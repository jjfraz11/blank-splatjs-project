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

function generatePositions(canvas, playerSize){
    var centerLane = canvas.width/2 - playerSize/2;
    var laneWidth = 100;

    return {
        lanes: [
            centerLane + laneWidth,
            centerLane,
            centerLane - laneWidth
        ],

        leftBound: canvas.width/2 - canvas.width*0.2 + 100,
        rightBound: canvas.width/2 + canvas.width*0.2 - 100,
        playerStart: canvas.height*(7/8),
        obstacleStart: canvas.height*(1/8)
    };
}

// function spawnObstacle(){
// }

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
    var playerSize = 50;
    var Positions = generatePositions(canvas, playerSize);

    // initialization
    this.player = new Splat.Entity(Positions.lanes[1],Positions.playerStart,playerSize,playerSize);
    this.player.color = "red";
    this.player.vy = -1;

    this.obstacle = new Splat.Entity(Positions.lanes[randomNumber(3)],
                                     Positions.obstacleStart, 40, 40);

    this.camera = new Splat.EntityBoxCamera(this.player,
                                            canvas.width, canvas.height*(1/8),
                                            canvas.width/2, canvas.height*(15/16));

    this.positions = Positions;
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
}, function(context) {
    // draw
    context.fillStyle = "#ffffff";
    context.fillRect(canvas.width/2 - canvas.width*0.2, this.player.y - this.positions.playerStart,
                     canvas.width*0.4, canvas.height);

    drawEntity(context, this.player);

    drawEntity(context, this.obstacle);
}));

game.scenes.add("plane", new Splat.Scene(canvas, function() {
    // initialization
    var playerImage = game.images.get("plane-idle");
    this.player = new Splat.AnimatedEntity(canvas.width/2 - 25,canvas.height/2 -25,playerImage.width,playerImage.height,playerImage,0,0);
    this.player.color = "blue";
}, function() {
    // simulation

    //possibly change controls ( tb discussed)
    //move left
    if((game.keyboard.consumePressed("left") || game.keyboard.consumePressed("a")) && this.player.x >canvas.width/2 - canvas.width*0.2 + 100){
	this.player.x -= 150;
    }
    //move right
    if((game.keyboard.consumePressed("right") || game.keyboard.consumePressed("d")) && this.player.x < canvas.width/2 + canvas.width*0.2 - 100){
	this.player.x += 150;
    }
    //move up
    if((game.keyboard.consumePressed("up") || game.keyboard.consumePressed("w")) && this.player.y > canvas.height/2 - canvas.height*0.2 + 120){
	this.player.y -= 150;
    }
    //move down
    if((game.keyboard.consumePressed("down") || game.keyboard.consumePressed("s")) && this.player.y < canvas.height/2 + canvas.height*0.2 - 120){
	this.player.y += 150;
    }
}, function(context) {
    // draw
    context.fillStyle = "#ffffff";
    context.fillRect(0, canvas.height/2 - canvas.height*0.2, canvas.width, canvas.height*0.4);
    drawEntity(context,this.player);
    // this.player.draw(context);
}));

game.scenes.switchTo("loading");
