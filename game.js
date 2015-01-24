"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
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
	this.player = new Splat.Entity(100,100,50,50);
	this.player.color = "blue";
}, function() {
	// simulation
	if((game.keyboard.consumePressed("left") || game.keyboard.consumePressed("a")) && this.player.x >0){
		this.player.x -= 100;
	}
	if((game.keyboard.consumePressed("right") || game.keyboard.consumePressed("d")) && this.player.x < 200){
		this.player.x += 100;
	}
}, function(context) {
	// draw
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawEntity(context,this.player);
}));

game.scenes.switchTo("loading");
