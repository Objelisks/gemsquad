define(function(require) {
	var component = require('component');
	var keys = new THREEx.KeyboardState();

	var moveSpeed = 50.0;
	var clock = new THREE.Clock();

	/*
		input component
		updates the target entity based on keyboard input
	*/
	var input = function(target) {
		component.call(this, 'input', target);
	}

	input.prototype = Object.create(component.prototype);

	input.prototype.update = function() {
		var delta = clock.getDelta();

		// TODO: handle joystick
		// TODO: handle mouse
		if(keys.pressed('up')) {
			this.target.position.z -= moveSpeed * delta;
		}
		if(keys.pressed('down')) {
			this.target.position.z += moveSpeed * delta;
		}
		if(keys.pressed('left')) {
			this.target.position.x -= moveSpeed * delta;
		}
		if(keys.pressed('right')) {
			this.target.position.x += moveSpeed * delta;
		}

		if(keys.pressed('q')) {
			this.target.position.y += moveSpeed * delta;
		}
		if(keys.pressed('a')) {
			this.target.position.y -= moveSpeed * delta;
		}
	}

	input.addOnce = function(key, cb) {
		var thing = function(e) {
			if(e.key === key) {
				window.removeEventListener(thing);
				cb();
			}
		}
		window.addEventListener('keypress', thing);
	}

	return input;
});