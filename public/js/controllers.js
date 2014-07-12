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
    socket.emit('introduction', $scope.user);

    socket.on('hello', function(msg){
      $scope.msg = msg;
    });
  }).
  controller('NavbarCtrl', function ($scope, $location){
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
