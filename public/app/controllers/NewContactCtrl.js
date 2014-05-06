'use strict';

angular.module('KinoaApp')
    .controller('NewContactCtrl', function ($scope, dpd, $location, $log, EnumService) {
        $scope.creation = true;

        $scope.civilities = EnumService.civilities;

        $scope.createContact = function (contact) {
            $log.log("Create a contact: ", contact);
            dpd.contacts.post(contact, function (data, status, headers, config) {
                $location.path("/contacts/" + data.id);
            });
        }

    });