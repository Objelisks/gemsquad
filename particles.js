define(function(require) {
	var component = require('component');
	var shader = require('shader');

	var particles = function(target) {
		component.call(this, 'particles', target);
		var points = new THREE.Geometry();
		var material = shader('shaders/dust');

		var scale = 20.0;

		for (var i = 0; i < 2000; i++) {
			var pt = new THREE.Vector3(Math.random(), Math.random(), Math.random());
			for(var x = -1; x <= 1; x++) {
				for (var y = -1; y <= 1; y++) {
					points.vertices.push(new THREE.Vector3(x, 0, y).add(pt).multiplyScalar(scale).addScalar(-scale/2.0));
				}
			}
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