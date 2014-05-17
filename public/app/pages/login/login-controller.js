'use strict';

angular.module('KinoaApp')
    .controller('LoginCtrl', function ($scope, $rootScope, $location, dpd, $http, AuthService, $log) {
        $scope.login = function () {
            if (!$scope.user || !$scope.user.email || !$scope.user.passwd) {
                $scope.error = "Merci de remplir les champs email et mot de passe";
                return;
            }
            delete $scope.error;
            $scope.loading = "Chargement en cours, merci de patienter";
            AuthService.login({
                username: $scope.user.email,
                password: $scope.user.passwd
            }, function (result) {
                $location.path("/");
            }, function (err) {
                delete $scope.loading;
                $log.log(err);
                var errorMessage = "Probleme lors de votre connexion, merci de réessayer.";
                if (typeof err === 'undefined' || err === null || err === '') {
                    errorMessage = "Il semble y avoir un probleme avec le serveur. Si le problème persiste, merci de contacter Nicolas.";
                } else if (err.status === 401) {
                    errorMessage = "Votre identifiant ou mot de passe n'est pas correct, merci de réessayer.";
                }
                $scope.error = errorMessage;
            })
        }

    });
