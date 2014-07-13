'use strict';

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

function _onChange (f, stats, prev) {
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

function _watchFile (watchDir, watchFile, callback) {
	readSize = 0;
	getAll = 1;

	watch.createMonitor(watchDir, { filter: _fileFilter }, function (monitor) {
		monitor.on("changed", _onChange);
		parser.on('readable', function() {
			var record;
			while(record = parser.read()) {
				callback(record);
			}
		})
	})
}

var pumpdata = {
	watchFile: _watchFile	
}

module.exports = pumpdata