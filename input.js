define(function(require) {
	var component = require('component');
	var keys = new THREEx.KeyboardState();

	/*
		input component
		updates the target entity based on keyboard input
	*/
	var input = function(target) {
		component.call(this, 'input', target);
	}

	input.prototype = Object.create(component.prototype);

	input.prototype.update = function() {
		// TODO: handle joystick
		// TODO: handle mouse
		if(keys.pressed('up')) {
			this.target.position.z -= 0.1;
		}
		if(keys.pressed('down')) {
			this.target.position.z += 0.1;
		}
		if(keys.pressed('left')) {
			this.target.position.x -= 0.1;
		}
		if(keys.pressed('right')) {
			this.target.position.x += 0.1;
		}
	}

	return input;
});