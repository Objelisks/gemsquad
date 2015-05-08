define(function(require) {

	// gets a single remoet thing and runs a callback when returned
	var getThing = function(name, cb, i) {
		var xhr = new XMLHttpRequest();

		xhr.onload = function(e) {
			if(xhr.status === 200) {
				cb(xhr.responseText, i);
			}
		};

		xhr.open('GET', './' + name, true);
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.send(null);
	};

	// gets a list of things and runs a callback when all are loaded
	var getThings = function(thingList, cb) {
		var finishedThings = [];
		var remainingThings = thingList.length;
		var finishThings = function(thing, i) {
			finishedThings[i] = thing;
			remainingThings--;
			if(remainingThings <= 0) {
				cb(finishedThings);
			}
		};

		for (var i = 0; i < thingList.length; i++) {
			getThing(thingList[i], finishThings, i);
		}
	}

	return {
		getThing: getThing,
		getThings: getThings
	}
})