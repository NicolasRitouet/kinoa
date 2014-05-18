'use strict';

angular.module('KinoaApp')
    .controller('DetailsTaxesCtrl', function ($scope, $routeParams, dpd, CountryService, AuthService, $log) {

        // Initialize with default values
        $scope.countryList = CountryService.findAll();


        // Load data about taxes
        var taxeId = $routeParams.taxesId;

        $scope.taxe = null;
        dpd.taxes.get({id: taxeId}, function (data, status, headers, config) {
            $scope.taxe = data;
            console.log("Load taxe");
        });

        // Update taxe
        $scope.updateTaxe = function (taxe) {
            dpd.taxes.put(taxeId, taxe, function (data, status, headers, config) {
                if (status < 400) {
                    var infoMessage = "Centre d'impôt " + data.name + " mise à jour."
                    $log.log(infoMessage);
                    $scope.info = infoMessage;
                } else {
                    var errorMessage = "Erreur pendant la sauvegarde du centre d'impôt " + taxe.name;
                    $log.err(errorMessage);
                    $scope.error(errorMessage);
                }
            });
        }


        $scope.associatedCompanies = [];
        dpd.companytotaxe.get({taxeId: taxeId}, function (data, status, headers, config) {
            for (var index in data) {
                dpd.companies.get({id: data[index].companyId, includeCompanytouser: AuthService.currentUser().id}, function (data2, status2, headers2, config2) {
                    $log.log(data2);
                    $scope.associatedCompanies.push(data2);
                });
            }
        });


    });
  	

