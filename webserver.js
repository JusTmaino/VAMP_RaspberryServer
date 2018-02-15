var http = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(http)
var Gpio = require('onoff').Gpio;
var LOCK_RELAY = new Gpio(4, 'out');

http.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/public/index.html', function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {
  var lockValue = 1;

  socket.on('lock', function(data) {
    lockValue = data;
    if (lockValue != LOCK_RELAY.readSync()) {
      LOCK_RELAY.writeSync(lockValue);
    }
  });
});

process.on('SIGINT', function () {
  LOCK_RELAY.writeSync(0);
  LOCK_RELAY.unexport();
  process.exit();
});
