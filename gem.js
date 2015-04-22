define(function(require) {
	var component = require('component');
	var shader = require('shader')


	var gemShader = shader('shaders/gem');

	/*
		gem component
	*/
	var gem = function(target) {
		component.call(this, 'gem', target);

		var color = new THREE.Color().setHSL(Math.random(), 0.5, 0.6);

		target.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), gemShader));
		//target.add(new THREE.Sprite(gemShader));
	}

	gem.prototype = Object.create(component.prototype);

	return gem;
});