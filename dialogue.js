define(function(require) {
	var component = require('component');
	var input = require('input');

	var color = function(color) {
		return function(words) { return {c:color, text:words}; };
	}
	var red = color('#c00');
	var blue = color('#44c');
	var green = color('#0c0');
	var yellow = color('#cc0');

	var img = function(words) { return {img:words, text:''}; };
	var small = function(words) { return {small:true, text:words}; };

	var fontStyle = {
		size: 1,
		curveSegments: 4,
		font: 'helvetiker',
		weight: 'bold',
		style: 'normal'
	};

	var createDialogue = function(seq) {

		var dialogue = function(target) {
			component.call(this, 'dialogue', target);

			this.seqIndex = 0;

			var self = this;
			var nextSeq = function() {
				self.seqIndex += 1;
			};

			var seqMeshes = seq.map(function(item) {
				var seqObj = new THREE.Object3D();

				var pos = 0;
				item.text.forEach(function(word) {

					var style = Object.create(fontStyle);
					var text = word.text ? word.text : word;
					if(text == '') return;

					var geometry = new THREE.ShapeGeometry(THREE.FontUtils.generateShapes(text, style));

					var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:word.c ? word.c : '#ccc'}));
					mesh.position.x = pos;
					seqObj.add(mesh);

					geometry.computeBoundingBox();
					pos += geometry.boundingBox.max.x + 0.4;
				});

				if(item.btn) {
					input.addOnce(item.btn, nextSeq);
				}
				if(item.time) {
					setTimeout(nextSeq, item.time);
				}

				return seqObj;
			});

			this.target.add(seqMeshes[0]);
		}

		dialogue.prototype = Object.create(component.prototype);

		return dialogue;
	}

	createDialogue.intro = [
		{
			text: ['press', green('A'), 'to interact with', red('space'), '+', yellow('time')],
			btn: 'A'
		},
		{
			text: ['congratulation. you have mastered ', small('interaction')],
			time: 4000
		}
	];


	return createDialogue;
});