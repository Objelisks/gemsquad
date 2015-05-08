define(function(require) {
	var shader = require('shader');

	/*
		terrain component
		provides visual representation of terrain
	*/
	var terrain = function(actualCamera) {

		this.material = shader('shaders/terrain.vertex', 'shaders/terrain_ruins.fragment');
		//this.material.uniforms.res = {type: '2f', value: new THREE.Vector2(window.innerWidth, window.innerHeight) };
		console.log(this.material.uniforms.res);

		this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
		this.scene  = new THREE.Scene();

		this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.material);
		this.scene.add(this.quad);

		/*

		var geometry = new THREE.Geometry();
		var material = shader('shaders/terrain');
		//var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
		var mesh = new THREE.Mesh(geometry, material);

		geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		geometry.vertices.push(new THREE.Vector3(0, 0, 1));
		geometry.vertices.push(new THREE.Vector3(1, 0, 1));
		geometry.vertices.push(new THREE.Vector3(1, 0, 0));

		geometry.faces.push(0, 1, 3);
		geometry.faces.push(1, 2, 3);
		geometry.verticesNeedUpdate = true;
		geometry.elementsNeedUpdate = true;

		*/

		/* heightmap

		var scale = 0.5;
		var width = 100;
		var height = 100;
		var offx = -50;
		var offy = -50;

		for (var y = 0; y < height; y++) {
			for(var x = 0; x < width; x++) {
				var vertex = new THREE.Vector3((x + offx + (0.5 * (y % 2))) * scale, Math.cos(x*scale) / 5.0, (y + offy) * scale);
				geometry.vertices.push(vertex);
			}
		}

		var flip = false;
		for(var v = 0; v < width*(height-1); v+=1) {
			if((v % width) === height-1) {
				flip = !flip;
				continue;
			}

			if(flip) {
				geometry.faces.push(new THREE.Face3(v+1, v, v+width+1));
				geometry.faces.push(new THREE.Face3(v, v+width+1, v+width));
			} else {
				geometry.faces.push(new THREE.Face3(v+1, v, v+width));
				geometry.faces.push(new THREE.Face3(v+1, v+width, v+width+1));
			}
		}


		geometry.verticesNeedUpdate = true;
		geometry.elementsNeedUpdate = true;
		//geometry.computeLineDistances();
		//geometry.computeFaceNormals();
		//geometry.computeVertexNormals();

		*/

		// target.add(mesh);
	}

	terrain.prototype.render = function(renderer) {
		renderer.render(this.scene, this.camera);
	}

	// TODO: check collision
	// TODO: make more interesting terrain
	// TOOD: streamable terrain loading based on distance
	// TODO: lod

	// ideas:
	/*
		triangulated hexagonal grid
		cliff faces effect on edge
		
	*/

	return terrain;
});