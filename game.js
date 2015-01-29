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
        "death": "img/deathImage.png",
	"emptyPlane": "img/emptyPlane.png",
	"manhole": "img/manhole.png",
	"policeCar": "img/police.png",
	"racer": "img/racer.png",
	"sidewalkLine": "img/sidewalkLine.png",
	"squirrel": "img/squirel.png",
	"street": "img/street.png",
	"streetPatch1": "img/streetPatch1.png",
	"streetPatch2": "img/streetPatch2.png",
	"streetPatch3": "img/streetPatch3.png",
	"streetPatch4": "img/streetPatch4.png",
    "title": "img/title.png",
	"workers": "img/workers.png"
    },
    "sounds": {
        "title-music":"sound/Title-Divider.mp3",
        "runman-music": "sound/runman-Bees_In_My_Blood.mp3",
        "roll": "sound/roll.mp3",
        "run": "sound/run.mp3",
        "hit": "sound/playerhit.mp3"
    },
    "fonts": {
    },
    "animations": {
        "runman" : {
            "strip": "img/walk-anim.png",
            "frames": 4,
            "msPerFrame": 100
        },
        "rollman": {
            "strip": "img/roll-anim.png",
            "frames": 8,
            "msPerFrame": 50
        },
        "death": {
            "strip": "img/death.png",
            "frames": 5,
            "msPerFrame": 80
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

        randomLane: function() { return sampleArray(this.lanes); },
        renderStart: function() { return player.y - renderDistance; }
    };
}


function drawEntity(context, drawable, color){
    if (drawable instanceof Splat.AnimatedEntity ) {
        drawable.draw(context);
    } else {
        context.fillStyle = color;
        context.fillRect(drawable.x, drawable.y, drawable.width, drawable.height);
    }
}

function fnRandomInterval(minInterval,range) {
    return function randomInterval() {
        return randomNumber(range) + minInterval;
    };
}

function sampleArray(array) {
    return array[randomNumber(array.length)];
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

function switchScene(myGame, key, sceneName) {
    if(myGame.keyboard.isPressed(key)) {
	myGame.scenes.switchTo(sceneName);
    }
    /* goes into each scene:
       switchScene(game, "t", "title");
       switchScene(game, "m", "death");
       switchScene(game, "c", "car");
       switchScene(game, "h", "main");
       switchScene(game, "p", "plane");
    */
}

// function spawnPoliceCar(scene){
//     var policeCar = imageEntity("policeCar", scene.positions.randomLane(),scene.positions.renderStart());
//     scene.obstacles.push(policeCar);

//     return policeCar;
// }

// function spawnRacer(scene){
//     //TODO(frazier): factor out hardcoded number for lane
//     var racer = imageEntity("racer", scene.positions.randomLane(), scene.positions.renderStart());
//     scene.obstacles.push(racer);

//     return racer;
// }

function spawnWorker(scene){
    var worker = imageEntity("workers", scene.positions.lanes[randomNumber(2)], scene.positions.renderStart());
    scene.obstacles.push(worker);

    return worker;
}

function spawnCone(scene){
    var cone = imageEntity("cone", scene.positions.randomLane(), scene.positions.renderStart());
    scene.obstacles.push(cone);

    return cone;
}

function spawnManhole(scene){
    var manhole = imageEntity("manhole", scene.positions.randomLane(), scene.positions.renderStart());
    scene.obstacles.push(manhole);

    return manhole;
}

function spawnSquirrel(scene){
    var squirrel = imageEntity("squirrel", scene.positions.randomLane(), scene.positions.renderStart());
    scene.obstacles.push(squirrel);

    return squirrel;
}

function spawnCrack(scene){
    var crackObjects = [
        { type: "crack1", lane: scene.positions.lanes[0] },
        { type: "crack2", lane: scene.positions.lanes[2] }
    ];
    var selectedCrack = sampleArray(crackObjects);
    var crack = imageEntity(selectedCrack.type, selectedCrack.lane, scene.positions.renderStart());
    scene.effects.push(crack);

    return crack;
}

function spawnPatch(scene){
    var patchType = [ "streetPatch1", "streetPatch2", "streetPatch3", "streetPatch4" ][randomNumber(4)];
    var patch = imageEntity(patchType, scene.positions.randomLane(), scene.positions.renderStart());
    scene.effects.push(patch);

    return patch;
}

function imageEntity(imageTitle, xpos, ypos){
    var image = game.images.get(imageTitle);
    var entity = new Splat.AnimatedEntity(xpos, ypos, image.width, image.height, image, 0, 0);
    return entity;
}

function ObjectSpawner(scene, type, fnDelay, fnSpawn) {
    var spawner = this;

    this.spawn = function () { return fnSpawn(scene); };

    this.timer = new Splat.Timer(undefined, fnDelay(), function() {
        console.log(type + " spawn");
        spawner.spawn();

        this.expireMillis = fnDelay();
        this.reset();
        this.start();
    });
    this.timer.start();

    scene.timers[type] = this.timer;
    scene.spawners.push(spawner);

    return spawner;
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
    // initialization
    //var workers = game.images.get("workers");
   // var music = game.sounds.get("title-music");
    game.sounds.stop("runman-music");
    game.sounds.play("title-music",true);

    this.image = game.images.get("title");
}, function() {
    // simulation
    switchScene(game, "t", "title");
    switchScene(game, "m", "death");
    switchScene(game, "c", "car");
    switchScene(game, "h", "main");
    switchScene(game, "p", "plane");

    switchScene(game, "space", "main");
}, function(context) {
    // draw
    context.fillStyle = "#092227";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(this.image,0,0);
    context.fillStyle = "#fff";
    context.font = "25px helvetica";
    centerText(context, "Press Space to Begin", 0, canvas.height / 2 - 13);
}));

game.scenes.add("main", new Splat.Scene(canvas, function() {
    // initialization
    var scene = this;
    var speedUpInterval = 2000;

    game.sounds.stop("title-music");
    game.sounds.play("run",false);
    game.sounds.play("runman-music",true);

    var playerImage = game.animations.get("runman");

    this.hearts = 3;
    this.player = new Splat.AnimatedEntity(canvas.width/2 - 25,canvas.height*(7/8),playerImage.width,playerImage.height,playerImage,0,0); 

    this.player.collision = false;
    this.blinkCounter = 0;

    this.player.draw = function(context) {
        if ( this.collision ) {
            if (!this.visible) {
                return;
            }
        }
        Splat.AnimatedEntity.prototype.draw.call(this, context);
    };

    this.camera = new Splat.EntityBoxCamera(this.player,
                                            canvas.width, canvas.height*(1/8),
                                            canvas.width/2, canvas.height*(15/16));

    this.positions = generatePositions(canvas, this.player);

    this.player.currentLane = 1;
    this.player.color = "red";
    this.player.vy = -0.1;
    this.player.vx = 0;

    this.moveX = this.player.x;
    this.playerV = 0.5;

    this.spawners = [];
    this.obstacles = [];
    this.effects = [];

    this.coneSpawner     = new ObjectSpawner(scene, "cone",     fnRandomInterval(3000, 4000), spawnCone);
    this.crackSpawner    = new ObjectSpawner(scene, "crack",    fnRandomInterval(1000, 5000), spawnCrack);
    this.manholeSpawner  = new ObjectSpawner(scene, "manhole",  fnRandomInterval(5000, 5000), spawnManhole);
    this.patchSpawner    = new ObjectSpawner(scene, "patch",    fnRandomInterval( 500, 5000), spawnPatch);
    this.squirrelSpawner = new ObjectSpawner(scene, "squirrel", fnRandomInterval(7500, 2000), spawnSquirrel);
    this.workersSpawner  = new ObjectSpawner(scene, "workers",  fnRandomInterval(3000, 5000), spawnWorker);

    this.deathtimer = new Splat.Timer(undefined,400,function(){
        this.player.sprite = game.images.get("death");
    });

    this.timers.speedUp = new Splat.Timer(undefined, speedUpInterval, function(){
        scene.player.vy -= 0.1;
        console.log("Player speed: " + scene.player.vy);
        this.reset();
        this.start();
    });

    this.timers.speedUp.start();

}, function(elapsedMs) {
    //simulation
    var scene = this;

    switchScene(game, "t", "title");
    switchScene(game, "m", "death");
    switchScene(game, "c", "car");
    switchScene(game, "h", "main");
    switchScene(game, "p", "plane");

    //possibly change controls ( tb discussed)
    if((game.keyboard.consumePressed("left") || game.keyboard.consumePressed("a")) && this.player.currentLane > 0){
        this.player.currentLane -= 1;
        this.player.sprite = game.animations.get("rollman").flipHorizontally();
        game.sounds.play("roll");
    }

    if((game.keyboard.consumePressed("right") || game.keyboard.consumePressed("d")) && this.player.currentLane < this.positions.lanes.length - 1){
        this.player.currentLane += 1;
        this.player.sprite = game.animations.get("rollman");
        game.sounds.play("roll");
    }

    var moveX = this.positions.lanes[this.player.currentLane], moveY;
    if(this.player.x !== moveX){
        createMovementLine(this.player, moveX, moveY, this.playerV);
    } else {
        this.player.vx = 0;
        this.player.sprite = game.animations.get("runman");
    }

    //obstacle management
    // Define collision timer callback outside of loop
    var afterPlayerCollision = function() {
        scene.player.collision = false;
    };
    for( var x = 0; x < this.obstacles.length; x++){
        if(this.obstacles[x] && this.obstacles[x].y > this.player.y + canvas.height * (1/8)){
            this.obstacles.splice(x,1);
            
        }

        if(this.obstacles[x] && this.obstacles[x].collides(this.player)){
            this.obstacles.splice(x,1);

            this.hearts-=1;
            console.log(this.hearts);
            if (this.hearts <1){
                this.player.sprite = game.animations.get("death");
                this.deathtimer.start();
                for (var i =0; i < this.spawners.length; i++) {
                    this.spawners[i].timer.stop();
                }
                this.player.vy = 0;
                game.scenes.switchTo("death");
            }

            this.timers.playerCollision = new Splat.Timer(undefined, 1000, afterPlayerCollision);
            this.timers.playerCollision.start();
            this.player.vy = Math.ceil((10*scene.player.vy)/2)/10;
            this.player.collision = true;

            console.log("player hit");
        }
    }

    for( x = 0; x < this.effects.length; x++) {
        // Clean up off screen effects
        if(this.effects[x] && this.effects[x].y > this.player.y + canvas.height * (1/8)) {
            this.effects.splice(x,1);
        }
    }

    this.blinkCounter += elapsedMs;
    this.player.visible = !this.player.collision || ( Math.floor( this.blinkCounter / 100 ) % 2 === 1 );

    this.player.move(elapsedMs);

}, function(context) {
    // draw
    context.fillStyle = "#092227";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.drawImage(game.images.get("street"), canvas.width/2 - canvas.width*0.35, this.player.y - this.positions.renderDistance);
    //context.fillRect(canvas.width/2 - canvas.width*0.2, this.player.y - this.positions.renderDistance,
    //                 canvas.width*0.4, canvas.height);

    for(var i = 0; i< this.obstacles.length; i++){
        drawEntity(context, this.obstacles[i], this.obstacles[i].color);
    }

    for(i = 0; i < this.effects.length; i++) {
        drawEntity(context, this.effects[i], this.effects[i].color);
    }

    this.player.draw(context);
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
    switchScene(game, "t", "title");
    switchScene(game, "m", "death");
    switchScene(game, "c", "car");
    switchScene(game, "h", "main");
    switchScene(game, "p", "plane");

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
    context.fillStyle = "#092227";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, canvas.height/2 - canvas.height*0.2, canvas.width, canvas.height*0.4);

    this.player.draw(context);
}));

game.scenes.add("death", new Splat.Scene(canvas, function() {
    //shows the credits. still needs completion.
    // initialization
    //this.timer = new SplatTimer
}, function() {
    // simulation
    switchScene(game, "t", "title");
    switchScene(game, "m", "death");
    switchScene(game, "c", "car");
    switchScene(game, "h", "main");
    switchScene(game, "p", "plane");


}, function(context) {
    // draw
    context.fillStyle = "#092227";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#fff";
    context.font = "25px helvetica";
    centerText(context, "Game created by:", 0, canvas.height / 2);
    centerText(context, "Rex Soiano", 0, canvas.height / 2 + 25);
    centerText(context, "Wes Wright", 0, canvas.height / 2 + 50);
    centerText(context, "Jonathan Frazier", 0, canvas.height / 2 + 75);
    centerText(context, "Anthony Quisenberry", 0, canvas.height / 2 + 100);
    centerText(context, "Created using Splatjs", 0, canvas.height / 2 + 125);
    centerText(context, "Pixel art created by Joey Edwards", 0, canvas.height / 2 + 150);

    centerText(context, "Music by:", 0, canvas.height / 2 + 175);

    centerText(context, "Mr. Frisby's Beat Pocket", 0, canvas.height / 2 + 200);
    centerText(context, "Crooked Pulse", 0, canvas.height / 2 + 225);
    centerText(context, "Chris Zabriskie", 0, canvas.height / 2 + 250);
}));

game.scenes.add("car", new Splat.Scene(canvas, function() {
    //this is filler for in the mean time
    // initialization
}, function() {
    // simulation

    switchScene(game, "t", "title");
    switchScene(game, "m", "death");
    switchScene(game, "c", "car");
    switchScene(game, "h", "main");
    switchScene(game, "p", "plane");

}, function(context) {
    // draw
    context.fillStyle = "#092227";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#fff";
    context.font = "25px helvetica";
    centerText(context, "Game created by:", 0, canvas.height / 2);
    centerText(context, "[names here]", 0, canvas.height / 2 + 25);
    centerText(context, "Created using Splatjs", 0, canvas.height / 2 + 125);
    centerText(context, "Pixel art created by Joey Edwards", 0, canvas.height / 2 + 150);
}));

game.scenes.switchTo("loading");
