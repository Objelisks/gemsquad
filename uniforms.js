define(function(require) {
	return {
		time: { type: 'f', value: 0.0 },
		players: { type: 'v3v', value: [ new THREE.Vector3(1, 0, 1), new THREE.Vector3(1, 0, -1) , new THREE.Vector3(-1, 0, 1), new THREE.Vector3(-1, 0, -1) ]},
		playerSeeds: { type: 'iv', value: [1, 2, 3, 4]},
		playerCount: { type: 'i', value: 4 },
		korg: { type: '1fv', value: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] },
		simData: { type: 't', value: null }
	}
})