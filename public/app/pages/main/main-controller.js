'use strict';

angular.module('KinoaApp')
    .controller('MainCtrl', function ($scope, $rootScope, $log, dpd, $http, AuthService, _) {
        $scope.user = AuthService.currentUser();
        $scope.currentDate = new Date().getTime();
        $scope.vipCompanies = [];
        dpd.companytouser.get({userId: $scope.user.id, vip:true, includeCompany:true, $limit: 10, rightsLevel: {$gt:0}}, function(data, status, headers, config) {
            $scope.vipCompanies = data;
        });

        $scope.todos = [];
        dpd.todos.get({assignedId: $scope.user.id, status: '1', $sort: {dueDate: 1}, includeCompany: true, includeCompanytouser: $scope.user.id, includeAssignedUser: true}, function (data, status, headers, config) {
            $scope.todos = data;
        });
    });
