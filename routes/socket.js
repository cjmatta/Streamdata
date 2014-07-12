/*
 * Serve content over a socket
 */

module.exports = function (socket) {
  socket.emit('send:name', {
    name: 'Bob'
  });

  socket.on('introduction', function(id, msg){
  	console.log(id + ":" + msg);
  	socket.emit('hello', "Hello " + id + "!");
  })
};
