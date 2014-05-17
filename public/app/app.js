'use strict';

angular.module('KinoaApp', [
        'ngRoute',
        'ngGrid',
        'ngCookies',
        'dpd',
        'underscore',
        'ui.bootstrap',
        'pascalprecht.translate',
        'angularFileUpload'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/pages/main/main.html',
                controller: 'MainCtrl',
                auth: true
            })
            .when('/societes/', {
                templateUrl: 'app/pages/companyList/companyList.html',
                controller: 'CompanyListCtrl',
                auth: true,
                requireAdmin: true
            })
            .when('/societes/new', {
                templateUrl: 'app/pages/companyPage/companyPage.html',
                controller: 'NewCompanyCtrl',
                auth: true
            })
            .when('/societes/:societeId', {
                templateUrl: 'app/pages/companyPage/companyPage.html',
                controller: 'CompanyDetailsCtrl',
                auth: true
            })
            .when('/contacts/new', {
                templateUrl: 'app/pages/contactPage/detailsContact.html',
                controller: 'NewContactCtrl',
                auth: true
            })
            .when('/contacts/:contactId', {
                templateUrl: 'app/pages/contactPage/detailsContact.html',
                controller: 'DetailsContactCtrl',
                auth: true
            })
            .when('/centreimpots/new', {
                templateUrl: 'app/pages/taxePage/detailsTaxes.html',
                controller: 'NewTaxeCtrl',
                auth: true
            })
            .when('/centreimpots/:taxesId', {
                templateUrl: 'app/pages/taxePage/detailsTaxes.html',
                controller: 'DetailsTaxesCtrl',
                auth: true
            })
            .when('/login', {
                templateUrl: 'app/pages/login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/logout', {
                templateUrl: 'app/pages/logout/logout.html',
                controller: 'LogoutCtrl'
            })
            .when('/suivi', {
                templateUrl: 'app/pages/followup/followup.html',
                controller: 'FollowupCtrl',
                auth: true
            })
            .when('/aide', {
                templateUrl: 'app/pages/help/help.html',
                controller: 'HelpCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).config(function($provide) {
        $provide.decorator("$exceptionHandler", function($delegate, $window) {
            return function(exception, cause) {
                $delegate(exception, cause);
                alert("Une erreur vient de se produire, merci de noter la date et l'heure et d'envoyer un message à Nicolas.");
                console.log("Exception: ", exception);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/errors', true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.onload = function () {
                    // do something to response
                    console.log(this.responseText);
                };
                xhr.send('message=' + exception.message + '&cause=' + cause + '&exception=' + exception + '&errorUrl=' + $window.location.href + '&creationDate=' + new Date().getTime());
            };
        });
    })

    .run(function ($rootScope, $location, AuthService) {
        // redirect to login page if not authenticated
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            var loginPath = '/login';
            if (next.auth && !AuthService.isLogged()) {
                $location.path(loginPath);
            } // else => authenticated, keep going ...
            if (next.requireAdmin && !AuthService.isAdmin()) {
                $location.path('/');
            }
        });
    })
    .value('dpdConfig', ['companies', 'todos', 'contacts', 'companytocontact', 'taxes', 'companytotaxe', 'users', 'companytouser', 'upload']);
