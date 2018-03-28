var http = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(http)
var SerialPort = require('serialport');
var Gpio = require('onoff').Gpio;
var LOCK_RELAY = new Gpio(2, 'out');
var UNLOCK_RELAY = new Gpio(3, 'out');
var START_RELAY = new Gpio(23, 'out');
var STOP_RELAY = new Gpio(24, 'out');
var HORN_RELAY = new Gpio(14, 'out');
var FRONT_LEFT_UP_RELAY = new Gpio(21, 'out');
var FRONT_LEFT_DOWN_RELAY = new Gpio(20, 'out');
var FRONT_RIGHT_UP_RELAY = new Gpio(16, 'out');
var FRONT_RIGHT_DOWN_RELAY = new Gpio(12, 'out');
var BACK_LEFT_UP_RELAY = new Gpio(26, 'out');
var BACK_LEFT_DOWN_RELAY = new Gpio(19, 'out');
var BACK_RIGHT_UP_RELAY = new Gpio(13, 'out');
var BACK_RIGHT_DOWN_RELAY = new Gpio(6, 'out');

BACK_RIGHT_UP_RELAY.writeSync(1);
BACK_LEFT_UP_RELAY.writeSync(1);
FRONT_LEFT_UP_RELAY.writeSync(1);
FRONT_RIGHT_UP_RELAY.writeSync(1);
BACK_RIGHT_DOWN_RELAY.writeSync(1);
BACK_LEFT_DOWN_RELAY.writeSync(1);
FRONT_LEFT_DOWN_RELAY.writeSync(1);
FRONT_RIGHT_DOWN_RELAY.writeSync(1);
HORN_RELAY.writeSync(1);
LOCK_RELAY.writeSync(1);
UNLOCK_RELAY.writeSync(1);
START_RELAY.writeSync(1);
STOP_RELAY.writeSync(1);

var port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 9600
});

var Readline = SerialPort.parsers.Readline;
var parser = new Readline({delimiter: '\r\n'});
port.pipe(parser);


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

  //lock system
  socket.on('lock', function(data) {
      LOCK_RELAY.writeSync(data);
  });

  socket.on('unlock', function(data) {
      UNLOCK_RELAY.writeSync(data);
  });

  //start/stop engine
  socket.on('start', function(data) {
      START_RELAY.writeSync(data);
  });

  socket.on('stop', function(data) {
      STOP_RELAY.writeSync(data);
  });

  //horn
  socket.on('horn', function(data) {
      HORN_RELAY.writeSync(data);
  });

  //front left window
  socket.on('fl_window_up', function(data) {
      FRONT_LEFT_UP_RELAY.writeSync(data);
  });
  socket.on('fl_window_down', function(data) {
      FRONT_LEFT_DOWN_RELAY.writeSync(data);
  });

  //front right window
  socket.on('fr_window_up', function(data) {
      FRONT_RIGHT_UP_RELAY.writeSync(data);
  });
  socket.on('fr_window_down', function(data) {
      FRONT_RIGHT_DOWN_RELAY.writeSync(data);
  });

  //back left window
  socket.on('bl_window_up', function(data) {
      BACK_LEFT_UP_RELAY.writeSync(data);
  });
  socket.on('bl_window_down', function(data) {
      BACK_LEFT_DOWN_RELAY.writeSync(data);
  });

  //back right window
  socket.on('br_window_up', function(data) {
      BACK_RIGHT_UP_RELAY.writeSync(data);
  });
  socket.on('br_window_down', function(data) {
      BACK_RIGHT_DOWN_RELAY.writeSync(data);
  });

  //all windows
  socket.on('all_window_up', function(data) {
      BACK_RIGHT_UP_RELAY.writeSync(data);
      BACK_LEFT_UP_RELAY.writeSync(data);
      FRONT_LEFT_UP_RELAY.writeSync(data);
      FRONT_RIGHT_UP_RELAY.writeSync(data);
  });
  socket.on('all_window_down', function(data) {
      BACK_RIGHT_DOWN_RELAY.writeSync(data);
      BACK_LEFT_DOWN_RELAY.writeSync(data);
      FRONT_LEFT_DOWN_RELAY.writeSync(data);
      FRONT_RIGHT_DOWN_RELAY.writeSync(data);
  });



  parser.on('data', (line) => {
    var data = line.split(",")
    if (data[0] == "$GPRMC") {
      if (data[2] == "A") {
        var latidue=data[3]/100 + 0.227769 ;
        var longitude = data[5]/100 + 0.045330;
        socket.emit("langLat", latidue+","+longitude);
        console.log(latidue+","+longitude);
      }
    }
  });
});

process.on('SIGINT', function () {
  LOCK_RELAY.writeSync(0);
  LOCK_RELAY.unexport();
  process.exit();
});
