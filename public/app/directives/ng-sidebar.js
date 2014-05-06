'use strict';

angular.module('KinoaApp')
    .directive('ngSidebar', function (AuthService, dpd, $log, ContactsService, CompaniesService, $location) {
        return {
            templateUrl: 'partials/ng-sidebar.html',
            restrict: 'E',
            link: function ($scope, elem, attrs) {

                var bodyheight = $(document).height();
                $(".sidebarList").height(bodyheight-250);

                var user = AuthService.currentUser();
                $scope.resetSearchCompanies = function () {
                    $scope.filtreCompanies = "";
                }
                $scope.resetSearchCentres = function () {
                    $scope.filtreCentres = "";
                }
                
                $scope.searchContacts = function(filtreContacts) {
                    var filtre = {};
                     if (filtreContacts) {
                        var filtre = {
                            $or: [{
                                lastname: {
                                    $regex: filtreContacts,
                                    $options: 'i'
                                }
                            },{
                                firstname: {
                                    $regex: filtreContacts,
                                    $options: 'i'
                                }
                            
                            },{
                                company: {
                                    $regex: filtreContacts,
                                    $options: 'i'
                                }
                            
                            }]
                        }
                    }
                    ContactsService.searchContacts(filtre).then(function(data) {
                        $log.log(data);
                        $scope.contactList = data;
                    });
                }
                
                $scope.searchCompanies = function(filtreCompanies) {
                    var filtre = {
                        $limit: 500
                    };
                     if (filtreCompanies) {
                        filtre.name = {
                            $regex: filtreCompanies,
                            $options: 'i'
                        }
                    }
                    CompaniesService.getAllCompanies(filtre).then(function(data) {
                        $log.log(data);
                        if (data.length === 1) {
                            $location.path("/societes/" + data[0].id);
                        }
                        $scope.companyList = data;
                    });
                }

                dpd.taxes.get(function (result, status, headers, config) {
                    $scope.listeTaxes = result;
                });
                $scope.activeTab = attrs.activetab; // Hell yeah, lower case baby !
                $scope.selectedItem = attrs.selecteditem; // Hell yeah, lower case baby !
            }
        };
    });
