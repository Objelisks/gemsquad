define(function(require) {
	var component = require('component');
	var world = require('world');
	var entity = require('entity');
	var player = require('player');


	var initNetwork = false;

	// TODO: self hosted server
	var peerjs = new Peer({key: '2yoxnlq8h0k9'});

	/*
		Send a message packet to the server and optionally handle the response with a callback.
		Only works for json messages and plain text responses
	*/
	var messageServer = function(url, json, cb) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', connectionServerUrl);
		xmlhttp.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');

		if(cb !== undefined) {
			xmlhttp.onload = function() { cb(xmlhttp.responseText); };
		}
		xmlhttp.send(JSON.stringify(json));
	}

	// TODO: set up actual host
	// TODO: probably needs a auto restart script
	var connectionServerUrl = 'http://objelisks.rocks:44668';

	/*
		api for talking to the connection server
	*/
	var connectionServer = {
		// get a random id from active ids, will not return the id sent
		getId: function(cb) {
			// xhr request to server to get id
			var json = {req: 'getid', id: peerjs.id};
			messageServer(connectionServerUrl, json, cb);
		},
		// tell the server that you are still connected
		// TODO: lasts x minutes
		heartbeat: function() {
			// xhr post to server to update heartbeat
			var json = {req: 'heart', id: peerjs.id};
			messageServer(connectionServerUrl, json);
		}
	}


	// packet types
	var types = {
		'new': 0,
		'move': 1
	};

	// network object lists
	var peers = [];
	var senders = [];

	/*
		Sends a packet to each other connected peer
	*/
	var broadcast = function(packet) {
		peers.forEach(function(peer) {
			peer.send(packet);
		});
	}

	/*
		Helper for generating unique ids
	*/
	var idCounter = function() {
		var _id = 1;
		return function() {
			return _id++;
		}
	};

	// separate counters for each network object
	var genPeerId = idCounter();
	var genSenderId = idCounter();


	/*
		receiver component
		when messages are received by the peerjs client, they are sent to the appropriate receiver component
		each component handles the message on its own
	*/
	var receiver = function(target) {
		component.call(this, 'networkreceiver', target);
	}

	receiver.prototype = Object.create(component.prototype);

	/*
		handle each type of message
	*/
	receiver.prototype.handle = function(data) {
		switch(data.type) {
			case types.move:
				var pos = data.pos;
				// TODO: interpolate
				// TODO: take movement code out of network code
				this.target.position.set(pos.x, pos.y, pos.z);
				break;
		}
	}


	/*
		sender component
		every 1/30 second sends out information about this object to all other peers
	*/
	var sender = function(target) {
		component.call(this, 'networksender', target);
		this.id = genSenderId();
		senders.push(this);
		setInterval(this.send.bind(this), 1000/30);
	}

	sender.prototype = Object.create(component.prototype);

	/*
		package information from target and broadcast
	*/
	sender.prototype.send = function() {
		var packet = {
			type: types.move,
			id: this.id,
			pos: {
				x: this.target.position.x,
				y: this.target.position.y,
				z: this.target.position.z
			}
		};
		broadcast(packet);
	}

	/*
		Creates new receiver objects from a new ids message
		data should contain property 'ids', which is a list of new entities to create
		peerId is the peer that sent the message
		receiver components are saved to send messages to
	*/
	var newNetworkObject = function(data, peerId) {
		for (var i = 0; i < data.ids.length; i++) {
			var id = data.ids[i];
			var recvObj = new entity().of([player, receiver]);
			world.scene.add(recvObj);
			world.entities.push(recvObj);
			peers[peerId].receivers[id] = recvObj.getComponent('networkreceiver');
		}
	}

	/*
		handles a new connection
		send our objects to the peer, setup to receive packets from the peer
	*/
	var handleConnection = function(conn) {
		var peerId = genPeerId();
		peers[peerId] = conn;
		conn.peerId = peerId;
		conn.receivers = {};

		conn.on('error', function(err) { console.log('ERROR', err); });

		conn.on('data', function(packet) {

			switch(packet.type) {
				case types.new:
					newNetworkObject(packet, peerId);
					console.log('received new objects');
					break;
				case types.move:
					var obj = peers[peerId].receivers[packet.id];
					if(obj === undefined) {
						console.log('no object for', peerId, packet.id);
					} else {
						obj.handle(packet);
					}
					break;
			}
		});

		conn.on('open', function() {
			conn.send({type: 'hello'});

			// send initializer packets
			var ids = senders.map(function(sender) { return sender.id; });
			conn.send({type: types.new, ids: ids});
		});
	}

	/*
		If we have less than the ideal number of peers, find a new peer to connect to
	*/
	var attemptConnect = function() {
		if(peers.length < 1) {
			connectionServer.getId(function(id) {
				if(id === 'noid') {
					return;
				} else {
					console.log('connecting to', id);
					var conn = peerjs.connect(id);
					// TODO: handle error
					handleConnection(conn);
				}
			});
		}
	}

	// Once the game is fully connected to the peer server, start sending heartbeats
	peerjs.on('open', function(id) {
		console.log('my id:', id);
		if(!initNetwork) {
			return;
		}

		connectionServer.heartbeat();

		setInterval(connectionServer.heartbeat, 1000/2);
		setInterval(attemptConnect, 1000*10);
	});

	// whenever a new connection is received (other client initated), handle the connection
	peerjs.on('connection', function(conn) {
		console.log('new connection from', conn.peer);
		handleConnection(conn);
	});


	// Attempt to connect to new peers if needed every ten seconds

	// return components
	return {
		receiver: receiver,
		sender: sender
	};
})