'use strict';

var fs = require('fs'),
	Inotify = require('inotify-plusplus'),
	inotify = Inotify.create(true),
	unwatcher = null,
	func = null;

function _watch (d, f) {
	console.log(d);
	console.log(f);
}

function _startWatching (watchDir, watchFile) {

	unwatcher = inotify.watch({ modify: _watch(watchDir, watchFile) }, watchDir);
}

function _stopWatching () {
	console.log("Stopping watching");
	unwatcher();
}


module.exports = {
	startWatching: _startWatching,
	stopWatching: _stopWatching
}