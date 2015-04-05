var http = require('http');
var fs = require('fs');

// list of peers that have recently sent a heartbeat
var activeThings = {};
var timeOut = 1000;
var port = '44668';

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
        // update last updated time of current id
        activeThings[bodyJson.id] = Date.now();
        break;

      case 'getid':
        // dont return the id that was sent, do pruning here
        var ids = Object.keys(activeThings).filter(function(id) { return id !== bodyJson.id; });
        if(ids.length < 1) {
          console.log('no id to give');
          res.write('noid');
          break;
        }

        var chosenId = ids[Math.floor(Math.random() * ids.length)];
        console.log('chosen id', chosenId, 'to', bodyJson.id);
        res.write(chosenId);
        break;
        
    }
    
    res.end();
  });
});

// garbage collect
setInterval(function() {
  var ids = Object.keys(activeThings);
  var time = Date.now();
  for(var i=0; i<ids.length; i++) {
    var id = ids[i];
    if(activeThings[id] < (time - timeOut)) {
      delete activeThings[id];
      console.log(id, 'timed out');
    }
  }
}, 1000);

server.listen(port);
