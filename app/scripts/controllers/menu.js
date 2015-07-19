'use strict';

angular.module('assignmentRouterApp')
  .controller('MenuCtrl', function ($scope, UserService, $location) {
        $scope.user = UserService.user;
        $scope.route = UserService.route;
        UserService.login();

        $scope.setActive = function(loc) {
            $scope.route.is_admin = false;
            $scope.route.is_users = false;
            $location.path(loc);
            if (loc === '/admin') {
                $scope.route.is_admin = true;
            } else if (loc === '/users') {
                $scope.route.is_users = true;
            }
        };
  });
