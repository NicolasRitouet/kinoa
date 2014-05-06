'use strict';

angular.module('KinoaApp')
    .directive('ngFooter', function () {
        return {
            templateUrl: 'partials/ng-footer.html',
            restrict: 'E'
        };
    });
