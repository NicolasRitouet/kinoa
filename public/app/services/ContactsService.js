'use strict';

angular.module('KinoaApp')
    .factory('ContactsService', function ($http, $log, $q, _, EnumService) {
        var contactsEndpoint = '/contacts/';


        var getAllContacts = function(params) {
            var options = {
                cache: true
            }
            if (typeof params !== 'undefined') {
                options.params = params;
            }
            var deferred = $q.defer();
            $http.get(contactsEndpoint, options).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("Une erreur s'est produite en récupérant les contacts.");
            });
            return deferred.promise;
        }

        var searchContacts = function(filter) {

            var deferred = $q.defer();
            var params = encodeURI(JSON.stringify(filter));
            $http.get(contactsEndpoint + '?' + params).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("Une erreur s'est produite en récupérant les contacts.");
            });
            return deferred.promise;
        }

        var getContact = function(contactId) {
            var deferred = $q.defer();
            $http.get(contactsEndpoint + contactId).success(function(data) {
                if (data.firstname === 'MADAME'
                    || data.prefixname === 'MADAME'
                    || data.prefixname === 'Madame'
                    || data.prefixname === 'MME'
                    || data.prefixname === 'madame'
                    || data.prefixname === 'Mme') {
                    data.civility = 'madame';
                } else if (data.firstname === 'MONSIEUR'
                    || data.prefixname === 'MONSIEUR'
                    || data.prefixname === 'Monsieur'
                    || data.prefixname === 'monsieur'
                    || data.prefixname === 'M.') {
                    data.civility = 'monsieur';
                }
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("Une erreur s'est produite en récupérant le contact.");
            });
            return deferred.promise;
        }

        var updateContact = function(contact) {
            var deferred = $q.defer();
            $http.put(contactsEndpoint + contact.id, contact).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("Une erreur s'est produite en voulant mettre à jour le contact.");
            });
            return deferred.promise;
        }

        // Public methods
        return {
            getContact: getContact,
            getAllContacts: getAllContacts,
            updateContact: updateContact,
            searchContacts: searchContacts
        }




    });