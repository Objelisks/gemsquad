define(function(require) {
	var world = require('world');
	var uniforms = require('uniforms');

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth*.8, window.innerHeight*.8);
	document.body.appendChild(renderer.domElement);

	var clock = new THREE.Clock(true);

	var updateUniforms = function() {
		uniforms.time.value = clock.getElapsedTime();
	}

	/*
		draw all things
	*/
	var render = function() {
		requestAnimationFrame(render);
		updateUniforms();
		renderer.render(world.scene, world.camera);
	}

	return {
		// one time start render loop
		start: function() {
			render();
		},

		// one time initialize rendering related variables
		setup: function(world) {
			var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
			camera.position.y = 2;
			camera.position.z = 2;
			camera.lookAt(new THREE.Vector3(0, 0, 0));
			world.camera = camera;
		}
	};
})