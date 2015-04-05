define(function(require) {
	var world = {
		scene: null,
		camera: null,
		entities: null,
		player: null,
		terrain: null,
		add: function(entity) {
			world.scene.add(entity);
		},
		addUpdate: function(actor) {
			world.add(actor);
			world.entities.push(actor);
		}
	}
	return world;

	// addEntity
	// addActor
	// update loop
	// wait until all transitions are finished and insert to world once everything is definitely in place
});