/*
 * Serve content over a socket
 */

'use strict';

var _ = require('lodash'),
	filewatcher = require('./models/filewatcher'),
	clusterInfo = require('./models/clusterinfo'),
	pump = require('./models/Pump');

module.exports.register =  function (io) {
	// Socket.io Communication

	io.sockets.on('connection', function (socket) {
		socket.on('watchfile', function(username) {
			clusterInfo.clusterName(function(clustername) {
				var dirName = '/mapr/' + clustername + '/user/' + username + '/spark/output';
				console.log("Watching: " + dirName + 'output.csv');
				filewatcher.startWatching(dirName, 'output.csv');
			});
		});

		socket.on('stopwatching', function () {
			filewatcher.stopwatching();
		});
	});
}