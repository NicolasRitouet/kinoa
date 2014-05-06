'use strict';

angular.module('KinoaApp')
    .controller('LogoutCtrl', function ($scope, $location, $log, AuthService) {

        AuthService.logout(function (result) {
            $scope.isLogged = false;
            $scope.user = null;
            $location.path("/login");
        }, function (err) {
            $log.error("Could not logout()");
        });
    });
