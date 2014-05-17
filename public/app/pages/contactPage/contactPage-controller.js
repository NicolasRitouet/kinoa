'use strict';

angular.module('KinoaApp')
    .controller('DetailsContactCtrl', function ($scope, $routeParams, $log, dpd, AuthService, ContactsService, EnumService) {
        var contactId = $routeParams.contactId;
        $log.log(contactId);

        $scope.contact = null;
        ContactsService.getContact(contactId).then(function(data) {
            $scope.contact = data;
        });

        $scope.civilities = EnumService.civilities;

        $scope.associatedCompanies = [];
        dpd.companytocontact.get({contactId: contactId}, function (data, status, headers, config) {
            for (var index in data) {
                dpd.companies.get({id: data[index].companyId, includeCompanytouser: AuthService.currentUser().id}, function (data2, status2, headers2, config2) {
                    $log.log(data2);
                    $scope.associatedCompanies.push(data2);
                });
            }
        });

        $scope.updateContact = function (contact) {
            $log.log("Update a contact: ", contact);
            contact.lastModification = new Date().getTime();
            ContactsService.updateContact(contact).then(function(data) {
                var infoMessage = "Fiche contact " + data.firstname + " " + data.lastname + " mise à jour."
                $log.log(infoMessage);
                $scope.info = infoMessage;
            });
        };

    });
