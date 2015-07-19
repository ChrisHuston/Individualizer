'use strict';

angular.module('individualizerApp')
    .controller('MainCtrl', function ($scope, UserService) {
        $scope.user = UserService.user;
  });
