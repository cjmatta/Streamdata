'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
  }).
  controller('StartPageCtrl', function ($scope) {
    // socket.on('send:time', function (data) {
    //   $scope.time = data.time;
    // });
  }).
  controller('UserCtrl', function ($scope, $routeParams, socket) {
    $scope.user = $routeParams.user;
    $scope.data = [];

    socket.on('hello', function (msg) {
      $scope.msg = msg;
    });

    $scope.getRooms = function () {
      socket.emit('getrooms');
    }
    
    socket.on('rooms', function (data) {
      console.log("Rooms " + data);
    });

    socket.on('welcome', function (msg) {
      console.log('Welcome: ' + msg);
      $scope.msg = msg
    });

    socket.on('goodbye', function(msg) {
      console.log('Goodbye: ' + msg);
    });

    socket.on('data', function(record) {
      $scope.data.push(record);
    });

    var _joinRoom = function (user) {
      socket.emit('join room', { room: 'room:' + user,
                                 user: user });
    }

    var _leaveRoom = function (user) {
      socket.emit('leave room', { room: 'room:' + user,
                                 user: user });
    }

    var _leaveAllRooms = function () {
      socket.emit('leave all rooms');
    }

    _joinRoom($scope.user);

    // re-join room on connection
    socket.on('connected', function() {
      _leaveAllRooms();
      _joinRoom($scope.user);
    });

    $scope.$on("$destroy", function () {
      _leaveRoom($scope.user);
    });
    
  }).
  controller('NavbarCtrl', function ($scope, $location, socket) {
    $scope.projectName = "Streamdata";
  }).
  controller('FilestreamCtrl', function ($scope, socket, _) {
    $scope.watching_status = "Not watching file.";
    $scope.data = [];
    $scope._ = _;

    function addData (data, record) {
      if(!_.contains(_.keys(data), record.pumpID)) {
        data[record.pumpID] = [];
      }

      data[record.pumpID].push(record);
    }

    $scope.users = [{name: 'user1', value: 'user1'},
                   {name: 'user2', value: 'user2'},
                   {name: 'user3', value: 'user3'},
                   {name: 'user4', value: 'user4'},
                   {name: 'user5', value: 'user5'},
                   {name: 'user6', value: 'user6'},
                   {name: 'user7', value: 'user7'},
                   {name: 'user8', value: 'user8'}];

    $scope.user = $scope.users[0];
    $scope.startWatching = function() {
      socket.emit('watchfile', $scope.user.name);
      $scope.watching_status = "Watching file."
    }

    $scope.stopWatching = function () {
      socket.emit('stopwatching');
      $scope.watching_status = "Not watching file."
    }

    $scope.isWatching = function () {
      return $scope.watching_status === "Watching file.";
    }

    socket.on('data', function(record) {
      addData($scope.data, record);
      console.log($scope.data);
    });
  });
