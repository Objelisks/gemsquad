define(function(require) {
	var renderer = require('renderer').renderer;
	var component = require('component');
	var shader = require('shader');

	var PHYSICS_DATA_SIZE = 3; // bytes
	var simShader = shader('shaders/simulation');
	var uniforms = require('uniforms');

	// must be power of two
	var dataSize = 64;

	var gl = renderer.getContext();

	if ( !gl.getExtension( "OES_texture_float" )) {
		console.log( "No OES_texture_float support for float textures!" );
		return;
	}
	
	var dataCamera = new THREE.Camera();
	dataCamera.position.z = 1;

	var dataScene = new THREE.Scene();
	var passThruShader = shader('shaders/passthrough');

	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ) );
	dataScene.add(mesh);

	var renderTargetParams = {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		format: THREE.RGBAFormat,
		stencilBuffer: false,
		depthBuffer: false,
		type: THREE.FloatType
	};

	var renderTexture1 = new THREE.WebGLRenderTarget(dataSize, dataSize, renderTargetParams);
	var renderTexture2 = renderTexture1.clone();

	// used for initializing textures
	var simulationData = new Float32Array(dataSize * dataSize * 4); // initializes to zero
	var simulationTexture = new THREE.DataTexture(simulationData, dataSize, dataSize, THREE.RGBA, THREE.FloatType);
	simulationTexture.needsUpdate = true;

	simShader.uniforms.simData = { type: 't', value: null };
	passThruShader.uniforms.texture = { type: 't', value: null };

	var flipBuffer = true;

	// Takes a texture, and render out as another texture
	var renderTexture = function ( input, output ) {
		mesh.material = passThruShader;
		//passThruShader.uniforms.texture.value = input;
		renderer.render( dataScene, dataCamera, output );
	}

	var renderPosition = function(position, output) {
		mesh.material = simShader;
		simShader.uniforms.simData.value = position;
		renderer.render( dataScene, dataCamera, output, false );
	}

	renderTexture(simulationTexture, renderTexture1);
	renderTexture(simulationTexture, renderTexture2);

	renderPosition(renderTexture1, renderTexture2);
	renderPosition(renderTexture2, renderTexture1);

	var update = function() {
		if(flipBuffer) {
			renderPosition(renderTexture2, renderTexture1);
			uniforms.simData.value = renderTexture1;
		} else {
			renderPosition(renderTexture1, renderTexture2);
			uniforms.simData.value = renderTexture2;
		}
		flipBuffer = !flipBuffer;
	};
	setInterval(update, 1000/30);

	var physicsController = function(target) {
		component.call(this, 'physicsController', target);
		this.textureIndex = 0;
	}

	physicsController.prototype = Object.create(component.prototype);

	physicsController.prototype.update = function() {
		// update object from texture (simulation)

	}

	return physicsController;
});