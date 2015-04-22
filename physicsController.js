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
/*
	var dataScene = new THREE.Scene();
	var dataQuad = new THREE.Mesh(new THREE.PlaneBufferGeometry(dataSize, dataSize), simShader);
	dataQuad.position.z = -100;
	dataScene.add(dataQuad);
	//var dataCamera = new THREE.OrthographicCamera(dataSize / -2, dataSize / 2, dataSize / 2, dataSize / -2, -10000, 10000);
*/
	var dataCamera = new THREE.Camera();
	dataCamera.position.z = 1;

	var scene = new THREE.Scene();
/*
	var uniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2( dataSize, dataSize ) },
		texture: { type: "t", value: null }
	};
*/
	var passThruShader = shader('shaders/passthrough');

	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ) );
	scene.add(mesh);

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
		renderer.render( scene, dataCamera, output );
	}

	var renderPosition = function(position, output) {
		mesh.material = simShader;
		simShader.uniforms.simData.value = position;
		renderer.render( scene, dataCamera, output, false );
	}

	var sampleFrameBuffer = function(texture) {
		var context = renderer.getContext();
		var buffer = new Float32Array(dataSize * dataSize * 4);
		context.readPixels(0, 0, dataSize, dataSize, gl.RGBA, gl.FLOAT, buffer);
		return buffer;
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

		var b1 = sampleFrameBuffer();
		//objects[0].target.position.set(b1[0], b1[1], b1[2]);

		/*
		if(flipBuffer) {
			simShader.uniforms.simData.value = renderTexture1;
			renderer.render(dataScene, dataCamera, renderTexture2, true);
			simShader.uniforms.simData.value = renderTexture2;
		} else {
			simShader.uniforms.simData.value = renderTexture2;
			renderer.render(dataScene, dataCamera, renderTexture1, true);
			simShader.uniforms.simData.value = renderTexture1;
		}
		flipBuffer = !flipBuffer;*/
	};
	setInterval(update, 1000/30);

	var physicsController = function(target) {
		component.call(this, 'physicsController', target);
		this.textureIndex = 0;
		//this.target.velocity = new THREE.Vector3();
	}

	physicsController.prototype = Object.create(component.prototype);

	physicsController.prototype.update = function() {
		// update object from texture (simulation)

		//this.target.rotateX(0.02);
		//this.target.rotateY(0.1);

	}

	return physicsController;
});