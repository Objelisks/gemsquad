define(function(require) {
	var component = require('component');

	/*
		player component
		provides visual representation of player objects
	*/
	var player = function(target) {
		component.call(this, 'player', target);
		// TODO: make color a parameter
		var color = new THREE.Color().setHSL(Math.random(), 0.5, 0.6);

		this.seed = Math.floor(10000000 * Math.random());

		// TODO: more interesting geometry
		target.add(new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshLambertMaterial({color:color})));
	}

	player.prototype = Object.create(component.prototype);

	return player;
})