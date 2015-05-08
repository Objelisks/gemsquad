define(function(require) {

	var xhr = require('xhr');
	var uniforms = require('uniforms');

	var loadShader = function(name, frag) {
		// build shader
		var shaderMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			attributes: {}
		});

		var vertName = frag ? name : name+'.vertex';
		var fragName = frag ? frag : name+'.fragment';
		
		// load srcs
		xhr.getThings([vertName, fragName], function(srcs) {
			shaderMaterial.vertexShader = srcs[0];
			shaderMaterial.fragmentShader = srcs[1];
			shaderMaterial.needsUpdate = true;
		});

		return shaderMaterial;
	}

	return loadShader;
})