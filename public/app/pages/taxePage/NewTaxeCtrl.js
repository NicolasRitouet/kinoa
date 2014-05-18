'use strict';

angular.module('KinoaApp')
    .controller('NewTaxeCtrl', function ($scope, dpd, $location, CountryService) {

        // Initialize Default values
        $scope.countryList = CountryService.findAll();
        $scope.creation = true;


        $scope.createTaxe = function (taxe) {
            dpd.taxes.post(taxe, function (result, err) {
                console.log(result.id);
                $location.path("/centreimpots/" + result.id);
            });
        };


    });