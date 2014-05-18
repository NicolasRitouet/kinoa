'use strict';

angular.module('KinoaApp')
    .directive('ngFooter', function () {
        return {
            templateUrl: 'app/shared/directives/footer/footer.html',
            restrict: 'E'
        };
    });
