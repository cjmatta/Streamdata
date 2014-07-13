/*
 * Serve content over a socket
 */

var fs = require('fs'),
	watch = require('watch'),
	csv = require('csv'),
	readSize = 0,
	getAll = 1;

var parser = csv.parse({
	columns: ['pumpID',
			  'datetime',
			  'hz',
			  'displacement',
			  'flow',
			  'sedimentppm',
			  'psi',
			  'flowppm']
	});

function _fileFilter (f, stat) {
	if (f.indexOf('output.csv') > -1) {
		return true;
	}
	return false;
}

function _getWatcher (dirName, fileName, callback) {
	watch.createMonitor(dirName, {filter: _fileFilter}, function(monitor){
		callback(monitor);
	});
}

function _changedFile (f, stats, prev) {
	// I think the filter option in the createMonitor
	// function is buggy, so I'm re-checking here.
	if (!_fileFilter(f, stats)) return;

	if (prev) {
		if (getAll === 1) {
			readSize = 0;
		} else {
			readSize = prev.size;
		}
	} else {
		console.log("New file");
		readSize = 0;
	}

	console.log(f + " changed");
	// if it's smaller, wait half a second
	if (stats.size <= readSize) {
		console.log("No change, come back later.");	
		return;
	}

	// read the stream offset 
	var stream = fs.createReadStream(f, {
		start: readSize,
		end: stats.size
	});
	
	stream.on('error', function (error) {
		console.log("Caught " + error);
	});
	
	stream.on('data', function(chunk){
		console.log("Sending data from " + f);
		parser.write(chunk.toString());
	});

	getAll = 0;
}

module.exports = function (socket) {
  var user_id;
  var x = 0;
  var our_data = [];
  
  socket.on('introduction', function(id){
    user_id = id;
  	// send it back to the client
    socket.emit('hello', "Hello " + id + "!");
  });

  socket.on('join room', function(data){
    socket.join(data.room, function(err){
      if (err) {
        console.error(err);
      } else {
        console.log(data.user + " joined room: " + data.room);
        // send to entire room
        socket.to(data.room).emit('welcome', "welcome " + data.user);
      }
    });
  });

  socket.on('leave room', function(data){
    socket.leave(data.room, function(err){
      if (err) {
        console.error(err);
      } else {
        console.log(data.user + " left room: " + data.room);
        // send to entire room
        socket.to(data.room).emit('goodbye', "goodbye " + data.user);
      }
    });
  });

  socket.on('getrooms', function(data){
    socket.emit('rooms', socket.rooms);
  });
};
