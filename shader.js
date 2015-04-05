define(function(require) {

	var xhr = require('xhr');
	var uniforms = require('uniforms');

	var loadShader = function(name) {
		// build shader
		var shaderMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			attributes: {}
		});

		// load srcs
		xhr.getThings([name+'.vertex', name+'.fragment'], function(srcs) {
			shaderMaterial.vertexShader = srcs[0];
			shaderMaterial.fragmentShader = srcs[1];
			shaderMaterial.needsUpdate = true;
		});

		return shaderMaterial;
	}

	return loadShader;
})