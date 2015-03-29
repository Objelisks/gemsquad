define(function(require) {
	var component = require('component');

	/*
		terrain component
		provides visual representation of terrain
	*/
	var terrain = function(target) {
		component.call(this, 'terrain', target);

		var geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
		var material = new THREE.MeshLambertMaterial({color: 0xa0a0a0});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX(-Math.PI/2);

		for (var i = 0; i < geometry.vertices.length; i++) {
			geometry.vertices[i].z += Math.random() * 0.1;
		}

		geometry.verticesNeedUpdate = true;
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		target.add(mesh);
	}

	terrain.prototype = Object.create(component.prototype);

	// TODO: check collision
	// TODO: make more interesting terrain
	// TOOD: streamable terrain loading based on distance
	// TODO: lod

	return terrain;
});