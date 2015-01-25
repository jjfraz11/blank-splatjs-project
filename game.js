"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
    "images": {
	"runman-idle": "img/runman.png",
	"plane-idle": "img/plane.png",
        "cone": "img/cone.png",
	"crack1": "img/crack1.png",
	"crack2": "img/crack2.png",
	"emptyPlane": "img/emptyPlane.png",
	"manhole": "img/manhole.png",
	"police": "img/police.png",
	"racer": "img/racer.png",
	"sidewalkLine": "img/sidewalkLine.png",
	"squirel": "img/squirel.png",
	"street": "img/street.png",
	"streetPatch1": "img/streetPatch1.png",
	"streetPatch2": "img/streetPatch2.png",
	"streetPatch3": "img/streetPatch3.png",
	"streetPatch4": "img/streetPatch4.png",
	"workers": "img/workers.png"
    },
    "sounds": {
    },
    "fonts": {
    },
    "animations": {
        "runman" : {
            "strip": "img/walk-anim.png",
            "frames": 4,
            "msPerFrame": 100
        }
    }
};

var game = new Splat.Game(canvas, manifest);

function generatePositions(canvas, player){
    
    var laneWidth = 2*player.width;

    var centerLane = canvas.width/2 - player.width/2;
    var rightLane = centerLane + laneWidth;
    var leftLane = centerLane - laneWidth;
    var renderDistance = canvas.height*(7/8);

    player.x = centerLane;
    player.y = renderDistance;

    return {
        lanes: [ leftLane, centerLane, rightLane ],

        rightLane: rightLane,
        centerLane: centerLane,
        leftLane: leftLane,

        leftBound: leftLane - canvas.width*0.2,
        rightBound: rightLane + canvas.width*0.2,
        renderDistance: renderDistance,

        randomLane: function() { return this.lanes[randomNumber(this.lanes.length)]; },
        renderStart: function() { return player.y - renderDistance; }
    };
}

function spawnObstacle(positions){
    var o =new Splat.Entity(positions.randomLane(), positions.renderStart(), 40, 40);
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
 *@param {@link Entity} entity The entity that i being moved
 *@param {number} x The ending X-coordinate
 *@param {number} y The ending Y-coordinate
 *@param {number} velocity The speed at which the entity moves
 **/
function createMovementLine(entity, x, y, velocity){
    /**
     * adjust the velocity of the entity in the x direction
     **/
    var marginX = 1;
    if (x) {
        if( x - marginX > entity.x ) {
	    entity.vx = velocity;
        } else if ( x + marginX < entity.x ) {
	    entity.vx = -velocity;
        } else {
	    entity.vx = 0;
            entity.x = x;
        }
    }

    /**
     * adjust the velocity of the entity in the x direction
     **/
    var marginY = 0;
    if (y) {
        if( y > entity.y + marginY) {
	    entity.vy = velocity;
        } else if ( y < entity.y - marginY) {
	    entity.vy = -velocity;
        } else {
	    entity.vy = 0;
        }
    }
}

function drawObstacle(context, drawable, color){
    context.fillStyle = color;
    context.fillRect(drawable.x, drawable.y, drawable.width, drawable.height);
}

function createSpawner(scene, entity){
    entity.spawn = function (){
        var enemy = new Splat.Entity(this.x, this.y, 20, 20);
        enemy.color = "orange";
        scene.obstacles.push(enemy);
    };
    entity.color = "orange";
    entity.vy = -1;
}

// function objectSpawner(scene, type, fnSpawn) {
//     var spawner = {
//         spawn: fnSpawn
//     };
//     console.log(scene, type);

//     return spawner;
// }

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
    // initialization
    var scene = this;
    var playerImage = game.animations.get("runman");

    this.player = new Splat.AnimatedEntity(canvas.width/2 - 25,canvas.height*(7/8),playerImage.width,playerImage.height,playerImage,0,0); 

    this.camera = new Splat.EntityBoxCamera(this.player,
                                            canvas.width, canvas.height*(1/8),
                                            canvas.width/2, canvas.height*(15/16));

    this.positions = generatePositions(canvas, this.player);

    this.player.currentLane = 1;
    this.player.color = "red";
    this.player.vy = -1;
    this.player.vx = 0;

    this.moveX = this.player.x;
    this.playerV = 0.5;

    // this.spawners = [ objectSpawner(this, "obstacle", [ 20, 20 ], this.positions) ];
    this.obstacles = [];
    this.obstacles2 = [ spawnObstacle(this.positions) ];

    this.obstacleSpawnRight = new Splat.Entity(this.positions.rightLane, 20, 20, 20);
    this.obstacleSpawnCenter = new Splat.Entity(this.positions.centerLane, 20, 20, 20);
    this.obstacleSpawnLeft = new Splat.Entity(this.positions.leftLane, 20, 20, 20);
    
    console.log(JSON.stringify(this.obstacleSpawnLeft));

    createSpawner(this, this.obstacleSpawnRight);
    createSpawner(this, this.obstacleSpawnCenter);
    createSpawner(this, this.obstacleSpawnLeft);

    this.spawners = [
        this.obstacleSpawnRight,
        this.obstacleSpawnLeft,
        this.obstacleSpawnCenter
    ];

    
    //TODO:
    // Have spawners use entity template
    // Have spawners pick random lane
    // Create timers as properties of spawner
    // Fix spawners array on scene
    this.timers.spawnObstacle = new Splat.Timer(undefined, 5000, function(){
        for(var i; i < scene.spawners.length; i++) {
            scene.spawners[i].spawn();
        }
        this.reset();
        this.start();
    });

    this.timers.spawnObstacle.start();

}, function(elapsedMs) {
    //simulation
    //possibly change controls ( tb discussed)
    if((game.keyboard.consumePressed("left") || game.keyboard.consumePressed("a")) && this.player.currentLane > 0){
        this.player.currentLane -= 1;
    }

    if((game.keyboard.consumePressed("right") || game.keyboard.consumePressed("d")) && this.player.currentLane < this.positions.lanes.length - 1){
        this.player.currentLane += 1;
    }

    var moveX = this.positions.lanes[this.player.currentLane], moveY;
    if(this.player.x !== moveX){
        createMovementLine(this.player, moveX, moveY, this.playerV);
        console.log(this.player.x, moveX, moveY, this.player.currentLane);
    } else {
        this.player.vx = 0;
    }

    //obstacle management
    for( var x = 0; x < this.obstacles.length; x++){
        if(this.obstacles[x] && this.obstacles[x].y > this.player.y + canvas.height * (1/8)){
        this.obstacles.splice(x,1);
        console.log("got splice");
        }
        if(this.obstacles[x] && this.obstacles[x].collides(this.player)){
            console.log("player hit");
        }
    }
    

    if(game.keyboard.consumePressed("o")) {
        this.obstacles2.push(spawnObstacle(this.positions));
    }

    this.obstacleSpawnRight.move(elapsedMs);
    this.obstacleSpawnCenter.move(elapsedMs);
    this.obstacleSpawnLeft.move(elapsedMs);

    this.player.move(elapsedMs);

}, function(context) {
    // draw
    var scene = this;
    context.fillStyle = "#ffffff";
    context.drawImage(game.images.get("street"), canvas.width/2 - canvas.width*0.35, this.player.y - this.positions.renderDistance);
    //context.fillRect(canvas.width/2 - canvas.width*0.2, this.player.y - this.positions.renderDistance,
    //                 canvas.width*0.4, canvas.height);

    this.player.draw(context);
    context.fillstyle = "#00ff00";

    for(var i = 0; i< this.obstacles.length; i++){
        drawObstacle(context, this.obstacles[i], this.obstacles[i].color);
    }

    for(i = 0; i < this.obstacles2.length; i++) {
        drawEntity(context, this.obstacles2[i]);
    }

    drawEntity(context, scene.obstacleSpawnRight);
    drawEntity(context, scene.obstacleSpawnCenter);
    drawEntity(context, scene.obstacleSpawnLeft);

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
