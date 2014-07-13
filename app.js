
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

var pump = require('./models/Pump');

// Socket.io Communication
// io.sockets.on('connection', require('./routes/socket'));
io.sockets.on('connection', function (socket) {
	socket.on('join room', function(data){
    var watchDir = '/mapr/skohearts/user/' + data.user + '/spark/output';
    var watchFile = 'output.csv';

    socket.join(data.room, function () {
      console.log(data.user + " joined room: " + data.room);
      // send to entire room
      io.to(data.room).emit('welcome', "welcome " + data.user);
    });

    pump.watchFile(watchDir, watchFile, function(record) {
      io.to(data.room).emit('data', record);
    });
  });

  socket.on('leave room', function (data) {
    socket.leave(data.room, function () {
      console.log(data.user + " left room: " + data.room);
      // send to entire room
      io.to(data.room).emit('goodbye', "goodbye " + data.user);
    });
  });

  socket.on('getrooms', function(data){
    socket.emit('rooms', socket.rooms);
  });

});

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
