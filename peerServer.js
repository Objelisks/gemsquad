var http = require('http');
var fs = require('fs');

// list of peers that have recently sent a heartbeat
var activeThings = [];

var server = http.createServer(function(req, res) {
  // collect sent data
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  // all data collected, process
  req.on('end', function() {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200);

    var bodyJson = JSON.parse(body);
    switch(bodyJson.req) {
      case 'heart':
        // TODO: update last updated time of current id
        activeThings.push(bodyJson.id);
        console.log('heartbeat from ', bodyJson);
        break;
      case 'getid':
        // TODO: dont return the id that was sent, probably do pruning here
        var chosenId = activeThings[activeThings.length-1];
        console.log('chosen id', chosenId, 'to', bodyJson.id);
        res.write(chosenId);
        break;
    }
    
    res.end();
  });
});

server.listen('3000');