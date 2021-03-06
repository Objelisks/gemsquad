define(function(require) {
	var world = require('world');
	var uniforms = require('uniforms');
	var korgvar = require('korgvar');

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
	document.body.appendChild(renderer.domElement);
	renderer.autoClear = false;
	renderer.context.getExtension('EXT_frag_depth');


	var clock = new THREE.Clock(true);

	var updateUniforms = function() {
		uniforms.time.value = clock.getElapsedTime();
		if(world.player) {
			uniforms.players.value[0].copy(world.player.position);
		}
		for(var i=0; i<16; i++) {
			uniforms.korg.value[i] = korgvar[16+i];
		}
	}

	/*
		draw all things
	*/
	var render = function() {
		requestAnimationFrame(render);
		updateUniforms();

		renderer.setRenderTarget();
		
		// clear everything
		renderer.clear();

		// render terrain with depth info
		world.terrain.render(renderer);

		// render everything else using previous depth info
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
			world.camera = camera;
			uniforms.camera = {type: 'm4', value: camera.matrixWorld };
		},
		renderer: renderer
	};
})