'use strict';

var fs = require('fs'),
	maprClustrs = '/opt/mapr/conf/mapr-clusters.conf';

function _clusterName (callback) {
	fs.readFile(maprClustrs, function (err, data) {
		if (err) {
			throw err;
		}

		var first_line = data.toString().split('\n')[0];
		var clustername = first_line.split(/[ ,]+/)[0];
		callback(clustername);
	});
}

module.exports = {
	clusterName: _clusterName
}