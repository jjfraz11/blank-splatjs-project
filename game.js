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
	centerText(context, "Replace with Title Art", 0, canvas.height / 2 - 13);
}));
game.scenes.add("main", new Splat.Scene(canvas, function() {
	// initialization
	this.player = new Splat.Entity(canvas.width/2 - 25,canvas.height*(7/8),50,50);
	this.player.color = "blue";
}, function() {
	// simulation

	//possibly change controls ( tb discussed)
	if((game.keyboard.consumePressed("left") || game.keyboard.consumePressed("a")) && this.player.x >canvas.width/2 - canvas.width*0.2 + 100){
		this.player.x -= 150;

	}
	if((game.keyboard.consumePressed("right") || game.keyboard.consumePressed("d")) && this.player.x < canvas.width/2 + canvas.width*0.2 - 100){
		this.player.x += 150;
	}
}, function(context) {
	// draw
	context.fillStyle = "#ffffff";
	context.fillRect(canvas.width/2 - canvas.width*0.2, 0, canvas.width*0.4, canvas.height);
	drawEntity(context,this.player);
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
	//drawEntity(context,this.player);
	this.player.draw(context);
}));

game.scenes.switchTo("loading");
