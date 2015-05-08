define(function(require) {
	var component = require('component');
	var world = require('world');

	var cameraOffset = new THREE.Vector3(0, 10, 20);

	var camera = function(target) {
		component.call(this, 'camera', target);
	}

	camera.prototype = Object.create(component);

	camera.prototype.update = function() {
		var cameraTarget = cameraOffset.clone().add(this.target.position);
		world.camera.position.copy(cameraTarget);
		world.camera.lookAt(this.target.position);
	}

	return camera;
});