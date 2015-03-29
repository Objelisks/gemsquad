define(function(require) {
	
	/*
		component are added to entities to give them additional functionality
		name can be a unique id or a general name
		usage:
		component.call(this, name, target);
		componentclass.prototype = Object.create(component.prototype);

		var entity = new entity().of([componentclass]);
	*/
	var component = function(name, target) {
		this.name = name;
		this.target = target;
	}

	/*
		components can have an optional update function which is called when the entity updates
	*/
	component.prototype.update = function() {

	}

	return component;
});