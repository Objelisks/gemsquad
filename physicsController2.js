define(function(require) {
	var component = require('component');
	var shader = require('shader');

	var simShader = shader('shaders/simulation');

	var objectsCount = 64;

	var simGeometry = new BufferGeometry();
	var positions = new Float32Array(objectsCount * 3);

	var physicsController = function(target) {
		component.call(this, 'physicsController', target);
		this.textureIndex = 0;
	}

	physicsController.prototype = Object.create(component.prototype);

	physicsController.prototype.update = function() {
		// update object from texture (simulation)

		this.target.rotateX(0.02);
		this.target.rotateY(0.1);

	}

	return physicsController;
});