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

    socket.emit('introduction', $scope.user);

    socket.on('hello', function (msg) {
      $scope.msg = msg;
    });

    $scope.getRooms = function () {
      socket.emit('getrooms');
    }
    
    socket.on('testing', function (msg) {
      console.log(msg);
    });

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

    socket.emit('join room', { room: 'room:' + $scope.user,
                               user: $scope.user });
    $scope.$on("$destroy", function () {
      socket.emit('leave room', {room: 'room:' + $scope.user,
                                 user: $scope.user });
    });
    
  }).
  controller('NavbarCtrl', function ($scope, $location, socket){
    $scope.active_user = null;
    
    $scope.isUserActive = function (user) {
      return '/users/' + user === $location.path();
    }

    $scope.activateUser = function(user) {
      $scope.active_user = user;
    }

    $scope.users = ['user1',
                    'user2',
                    'user3',
                    'user4',
                    'user5',
                    'user6',
                    'user7',
                    'user8'];

    $scope.projectName = "Streamdata";
  });
