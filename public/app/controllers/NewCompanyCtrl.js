'use strict';

angular.module('KinoaApp')
    .controller('NewCompanyCtrl', function ($scope, $location, $log, CountryService, AuthService, CompaniesService) {

        $scope.creation = true;
        $scope.societe = {};

        $scope.countryList = CountryService.findAll();

        $scope.createCompany = function (newCompany) {
            var currentUser = AuthService.currentUser();
            $log.log("Create a company: ", newCompany);
            CompaniesService.createCompany(newCompany, currentUser).then(function(data) {
                $location.path("/societes/" + data.companyId);
            });
        }
    });