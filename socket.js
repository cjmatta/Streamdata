/*
 * Serve content over a socket
 */

'use strict';

var _ = require('lodash'),
	pump = require('./models/Pump');

module.exports.register =  function (io) {
	// Socket.io Communication
	// io.sockets.on('connection', require('./routes/socket'));
	io.sockets.on('connection', function (socket) {
	  var _leaveRoom = function (room) {
	    if (! _.contains(socket.rooms, room) ) {
	      return;
	    }
	      
	    socket.leave(room, function () {
	      console.log("left room: " + room);
	      // send to entire room
	      io.to(room).emit('goodbye', "goodbye");
	    });
	  }

	  var _joinRoom = function (room) {
	    console.log(socket.rooms);
	    
	    if (_.contains(socket.rooms, room) ){
	      console.log("Already in room");
	      return;
	    }

	    socket.join(room, function () {
	      console.log("joined room: " + room);
	      // send to entire room
	      io.to(room).emit('welcome', "welcome");
	    });
	  }

	  socket.emit('connected');
		socket.on('join room', function(data){
	    // var watchDir = '/mapr/skohearts/user/' + data.user + '/spark/output';
	    var watchDir = __dirname + '/data';
	    var watchFile = 'output.csv';
	      
	    _joinRoom(data.room);

	    pump.watchFile(watchDir, watchFile, function(record) {
	      console.log("Sending data to " + data.room);
	      io.to(data.room).emit('data', record);
	    });
	  });

	  socket.on('leave room', function (data) {
	    pump.stopWatching();
	    _leaveRoom(data.room);
	  });

	  socket.on('leave all rooms', function() {
	    _.each(socket.rooms, function(room) {
	      if (room.indexOf("room:user") > -1) {
	        _leaveRoom(room);
	      }
	    });
	  });

	  socket.on('getrooms', function(data){
	    socket.emit('rooms', socket.rooms);
	  });

	});
}