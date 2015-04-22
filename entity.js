define(function(require) {

	/*
		entities are extensions of the three js object class
		mostly they server as containers for components which add functionality
	*/
	var entity = function() {
		THREE.Object3D.call(this);
		this.components = [];
		this.namedComponents = {};
	}

	entity.prototype = Object.create(THREE.Object3D.prototype);

	/*
		update all components attached to this entity
	*/
	entity.prototype.update = function() {
		this.components.forEach(function(component) { component.update(); });
	}

	/*
		add some components to this entity
		the argument is a list of component constructors
		the constructors are passed the entity as an argument
	*/
	entity.prototype.of = function(list) {
		var self = this;
		list.forEach(function(componentConstructor) {
			var component = new componentConstructor(self);
			self.components.push(component);
			self.namedComponents[component.name] = component;
		});
		return this;
	}

	/*
		gets a component by name
	*/
	entity.prototype.getComponent = function(name) {
		return this.namedComponents[name];
	}

	return entity;
});