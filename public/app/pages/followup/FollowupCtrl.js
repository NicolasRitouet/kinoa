'use strict';

angular.module('KinoaApp')
    .controller('FollowupCtrl', function ($scope, dpd, $location, $log, CompaniesService) {

        $scope.loading = "Chargement en cours, merci de patienter...";
        
        var options= {
            status: {$in: [1, 5, 11]},
            $limit: 500
        };
        
        CompaniesService.getAllCompanies(options).then(function(data) {

            $scope.companyList = data;
            calculateTotals();
            delete $scope.loading;
        });

        var calculateTotals = function() {

            $scope.totalInvoiceAmount = 0;
            $scope.totalInvoiceRestant = 0;
            $scope.totalInvoicePaid = 0;
            var companyList = $scope.companyList;
            for (var i = 0; i < companyList.length; i++) {
                var invoiceAmount = companyList[i].invoiceAmount;
                if (invoiceAmount) {
                    $scope.totalInvoiceAmount += parseFloat(invoiceAmount);
                    if (companyList[i].invoicePaidOn) {
                        $scope.totalInvoicePaid += parseFloat(invoiceAmount);
                    } else {
                        $scope.totalInvoiceRestant += parseFloat(invoiceAmount);
                    }
                }
            }
        }

        $scope.updateCompany = function(company) {
            $log.log(company.invoicePaidOn);
            if (company.invoicePaidOn && Object.prototype.toString.call(company.invoicePaidOn) === "[object Date]" ) {
                company.invoicePaidOn =  company.invoicePaidOn.getTime();
            }
            if (company.cdifOn && Object.prototype.toString.call(company.invoicePaidOn) === "[object Date]" ) {
                company.cdifOn =  company.cdifOn.getTime();
            }
            if (company.comparOn && Object.prototype.toString.call(company.invoicePaidOn) === "[object Date]" ) {
                company.comparOn =  company.comparOn.getTime();
            }
            $log.log(company);

            CompaniesService.updateCompany(company).then(function(data) {
                var infoMessage = "Fiche entreprise " + data.name + " mise à jour."
                calculateTotals();
                $log.log(infoMessage);
                $scope.info = infoMessage;
            });
        }
    });