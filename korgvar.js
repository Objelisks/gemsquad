define(function(require) {

	var disable = true;

	var socket = disable ? null : io('ws://localhost:5000/');
	var vars = {};
	for(var i=0; i<64; i++) {
		vars[i] = 0.5;
	}

	if(!disable) {
		socket.on('connect', function() {
			socket.send('hi');
			socket.on('message', function(message) {
				vars[message.data[1]] = message.data[2] / 128.0;
			});
		});
	}

	return vars;
});