'use strict';

angular.module('KinoaApp')
    .factory('AuthService', function ($http, $log, $cookieStore, _) {
        var currentUser = $cookieStore.get('user');
        var login = function (user, success, error) {
            $log.log('AuthService.login()', user);
            $http.post('/users/login', user).success(function (result) {
                $http.get('/users/me').success(function (data) {
                    $cookieStore.put('user', data);
                    currentUser = data;
                    success(data);
                });
            }).error(error);
        };


        var logout = function (success, error) {
            $log.log('Logout');
            $http.post('/users/logout').success(function (result, err) {
                $cookieStore.remove('user');
                currentUser = null;
                success(result);
            }).error(function (result, err) {
                    error(err);
                });
        };


        // Public API
        return {
            login: login,
            isLogged: function () {
                return !_.isEmpty(currentUser);
            },
            logout: logout,
            currentUser: function () {
                return currentUser;
            },
            isAdmin: function () {
                if (_.isEmpty(currentUser)) {
                    return false;
                }
                return _.contains(currentUser.roles, 'admin');
            }
        };
    });