define(function(require) {
	var world = require('world');
	var renderer = require('renderer');
	var gameMode = require('gameMode');

	// initialize renderer and game mode
	renderer.setup(world);
	gameMode.setup(world);

	// start main game loops
	gameMode.start(); // 1/60s update loop
	renderer.start(); // 1/60s framerate (requestAnimFrame)
});