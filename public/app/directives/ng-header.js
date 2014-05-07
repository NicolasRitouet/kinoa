'use strict';

angular.module('KinoaApp')
    .directive('ngHeader', function (AuthService, $location, $log, $translate) {
        return {
            templateUrl: 'partials/ng-header.html',
            restrict: 'E',
            link: function (scope, elem, attrs) {
                scope.isLogged = AuthService.isLogged();
                scope.user = AuthService.currentUser();
                scope.isAdmin = AuthService.isAdmin();
                scope.changeLanguage = function(language) {
                    $translate.use(language);
                }
            }
        };
    });
