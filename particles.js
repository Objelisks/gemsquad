define(function(require) {
	var component = require('component');
	var shader = require('shader');

	var particles = function(target) {
		component.call(this, 'particles', target);
		var points = new THREE.Geometry();
		var material = shader('shaders/dust');

		for (var i = 0; i < 2000; i++) {
			points.vertices.push(new THREE.Vector3(Math.random() * 10 - 5, Math.random() * 20 - 10, Math.random() * 10 - 5));
		}

		points.verticesNeedUpdate = true;

		var pointCloud = new THREE.PointCloud(points, material);
		material.transparent = true;

		this.target.add(pointCloud);
	}

	particles.prototype = Object.create(component.prototype);

	particles.prototype.update = function() {
		// use vertex shader to float dust
	}

	return {
		dust: particles
	}
})