define(function(require) {
	var entity = require('entity');
	var terrain = require('terrain');
	var input = require('input');
	var player = require('player');
	var networked = require('network');
	var particles = require('particles');
	var camera = require('camera');

	// entities needs to be visible to update loop and setup
	var entities = [];

	return {
		/*
			start the game with 1/60 second update loop
		*/
		start: function() {
			var update = function() {
				entities.forEach(function(entity) {
					entity.update();
				});
			};
			setInterval(update, 1000/60);
		},

		/*
			one time setup call, initalizes world state
		*/
		setup: function(world) {
			var scene = new THREE.Scene();
			world.scene = scene;
			world.entities = entities;

			var sun = new THREE.DirectionalLight(0xffffff, 0.5);
			sun.position.set(0.3, 1, 0.5);
			world.add(sun);

			var dust = new entity().of([particles.dust]);
			world.addUpdate(dust);

			world.terrain = new terrain(world.camera);

			var p1 = new entity(true).of([input, player, camera, networked.sender]);
			world.addUpdate(p1);
			world.player = p1;

		}
	};
})