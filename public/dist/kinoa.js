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

'use strict';

angular.module('KinoaApp').config(function($translateProvider) {
    $translateProvider.translations('en', {
        'menu.help': 'Help',
        'menu.followup': 'Follow-up',
        'menu.add': 'Add',
        'menu.logout': 'Logout',
        'menu.login': 'Login',
        'menu.french': 'French',
        'menu.english': 'English',
        'menu.german': 'German',
        'login.message': 'Please enter your credentials',
        'login.email.placeholder': 'Your email',
        'login.password.placeholder': 'Your password',
        'login.submit.button': 'Login'
    }).translations('fr', {
        'menu.help': 'Aide',
        'menu.followup': 'Suivi',
        'menu.add': 'Ajouter',
        'menu.logout': 'Déconnexion',
        'menu.login': 'Connexion',
        'menu.french': 'Francais',
        'menu.english': 'Anglais',
        'menu.german': 'Allemand',
        'login.message': 'Merci de vous connecter',
        'login.email.placeholder': 'Votre email',
        'login.password.placeholder': 'Votre mot de passe',
        'login.submit.button': 'Connexion'
    });
    $translateProvider.preferredLanguage('en');
});
'use strict';

angular.module('KinoaApp')
    .controller('CompanyListCtrl', function ($scope, $log, dpd, CountryService, AuthService, CompaniesService, EnumService, $modal, _, $location) {

        // Initialize filter
        $scope.filter = {};


        // Loading needed values
        $scope.companyStatusList = EnumService.companyStatus;
        $scope.companyStatusListFilter = angular.copy($scope.companyStatusList);
        var defaultStatus = {
            french: 'Tous'
        }
        $scope.companyStatusListFilter.unshift(defaultStatus);
        $scope.filter.status = defaultStatus;

        $scope.search = function(filter) {
            $log.log(filter);
            $scope.loading = "Chargement en cours, merci de patienter...";
            var options = buildSearchParams(filter);
            CompaniesService.getAllCompanies(options).then(function(data) {
                $scope.companyList = data;
                delete $scope.loading;
            });
        }

        var buildSearchParams = function(filter) {
            var searchParams = {
                includeCompanytouser: true,
                $limit: 500
            };
            if (filter.status) {
                searchParams.status = filter.status.id
            }
            if (filter.name) {
                searchParams.name = {
                    $regex: filter.name,
                    $options: 'i'
                }
            }
            return searchParams;
        }
        
        dpd.users.get(function (data, status, headers, config) {
            $scope.users = data;
        });

        // Methods
        $scope.changeCompanyStatus = function(companyId, companyStatus) {
            $log.log(companyId, companyStatus);
            dpd.companies.put(companyId, {status: companyStatus}, function(data, status, headers, config) {
                if (status < 400) {
                    var infoMessage = "Statut de l'entreprise '" + data.name + "' mise à jour."
                    $log.log(infoMessage);
                    $scope.info = infoMessage;
                } else {
                    var errorMessage = "Erreur lors de de la mise à jour du statut de " + companyId;
                    $log.error(errorMessage);
                    $scope.error = errorMessage;
                }
            });
        }

        $scope.deleteCompany = function(company) {
            $log.log(company);
             var saisie = prompt("Vous vous appretez à supprimer l'entreprise \n\n'" + company.name + "'\n\nPour confirmer votre choix, merci de taper le nom de l'entreprise dans ce champ: ");
            if (saisie.toLowerCase() === company.name.toLowerCase()) {
                 (function(company2) { // IIFE FTW : http://bit.ly/18MDRaF
                    CompaniesService.deleteCompany(company2.id).then(function(response) {
                            var infoMessage = "L'entreprise '" + company2.name + "' a été corectement supprimé."
                            $log.log(infoMessage);
                            $scope.info = infoMessage;
                            var index = $scope.companyList.indexOf(company2);
                            $scope.companyList.splice(index, 1);
                        }, function(err) {
                            var errorMessage = "Erreur lors de de la suppression " + company2.name;
                            $log.error(errorMessage);
                            $scope.error = errorMessage;
                            throw errorMessage;
                        });
                })(company);
            }
        }


        $scope.batchStatusUpdate = function(filter, companyList) {
            $log.log(filter.status.id);
            for (var index in companyList) {
                var company = companyList[index];
                $log.log(company);
                CompaniesService.updateCompany({id:company.id, status: filter.status.id}).then(function(data) {
                    var infoMessage = "Les entreprises  ont été correctement mises à jour."
                    $scope.info = infoMessage;
                    $scope.search($scope.filter);
                });
            }
        }

        $scope.batchRightsUpdate = function(users, companyList) {
            if (typeof companyList === 'undefined') $scope.error = "La liste est vide !";
            if (companyList.length > 499) {
                $scope.error = "Vous avez trop de résultats, merci de filtrer.";
                return;
            }
            for (var index in users) {
                var user = users[index];
                if (typeof user.companytouser === 'undefined') continue;
                for (var indexCompany in companyList) {
                    var company = companyList[indexCompany];
                    (function(company, user) { // IIFE FTW : http://bit.ly/18MDRaF
                        CompaniesService.getCompanyToUser(user, company).then(function(data) {
                            if (data.length > 0) {
                                var companytouser = data[0];
                                companytouser.rightsLevel = user.companytouser.rightsLevel;
                                CompaniesService.updateCompanytouser(companytouser).then(function(responseUpdate) {
                                    var infoMessage = "Les entreprises ont été correctement mises à jour."
                                    $scope.info = infoMessage;
                                    $scope.search($scope.filter);
                                });
                            } else {
                                var companytouser = {
                                    rightsLevel: user.companytouser.rightsLevel,
                                    companyId: company.id,
                                    userId: user.id
                                }
                                CompaniesService.createCompanytouser(companytouser).then(function(responseUpdate) {
                                    var infoMessage = "Les entreprises ont été correctement mises à jour."
                                    $scope.info = infoMessage;
                                    $scope.search($scope.filter);
                                });
                            }
                        });
                    })(company, user);
                }
            }
        }

        // Ng-grid options
        $scope.gridOptions = {
            data: 'companyList',
            enablePinning: false,
            columnDefs: [

                { field: "id",
                    displayName: "Ouvrir",
                    width: 50,
                    cellTemplate: 'app/pages/companyList/companyList/companyListDisplay.html'
                },
                { field: "name", displayName: "Nom", width: 400, pinned: true },
                { field: "address1", displayName: "Adresse", width: 120 },
                { field: "postalCode", displayName: "Nom", width: 80 },
                { field: "city", width: 120 },
                { field: "country", width: 40 },
                { field: "website", width: 120 },
                { field: "phone", width: 120 },
                { field: "fax", width: 120 },
                /*{ field: "company.siret", width: 120 },
                { field: "company.finess", width: 120 },
                { field: "company.legalStatus", width: 60 },
                { field: "company.status", width: 40 },
                { field: "company.comments", width: 120 },
                { field: "company.tfSum", width: 120 },
                { field: "company.cfeSum", width: 120 },
                { field: "company.thSum", width: 120 },
                { field: "company.surface", width: 120 },
                { field: "company.capacity", width: 120 },
                { field: "company.capacityType", width: 120 },*/
                { field: "id",
                    displayName: "Droit d'accès",
                    width: 140,
                    cellTemplate: '<button class="btn btn-default btn-sm" ng-click="openRightsModal(row.getProperty(col.field))">Modifier les droits</button>'
                },
                { field: "status",
                    displayName: "Statut",
                    width: 200,
                    cellTemplate: 'app/pages/companyList/companyList/companyListStatusColumn.html'
                },
                { field: "id",
                    displayName: "Suppression",
                    width: 150,
                    cellTemplate: 'app/pages/companyList/companyList/companyListDeleteColumn.html'
                }
            ]

        };


        // Right management Modal
        $scope.openRightsModal = function(companyId) {
            $log.log("Opening modal for companyId : ", companyId);

            for (var index in $scope.users) {
                (function(user) { // IIFE FTW : http://bit.ly/18MDRaF
                    dpd.companytouser.get({companyId: companyId, userId: user.id}, function(result, status, headers, config) {
                        user.companytouser = result[0];
                    });
                })($scope.users[index])
            }

            var modalInstance = $modal.open({
                templateUrl: 'app/pages/companyList/companyList/companyListRightsModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    company: function() {
                        for (var index in $scope.companyList) {
                            if ($scope.companyList[index].id === companyId) {
                                return $scope.companyList[index];
                            }
                        }
                    },
                    users: function() {
                        return $scope.users;
                    }
                }
            });

            modalInstance.result.then(function (company) {
                for (var index in company.users) {
                    var user = company.users[index];    
                    var companytouser = user.companytouser;
                    if (!companytouser || !companytouser.id) {
                        $log.log("We are creating companytouser", companytouser);
                        if (typeof companytouser === 'undefined') {
                            continue;
                        }
                        companytouser.companyId = company.id;
                        companytouser.userId = user.id;
                        (function(company, companytouser) { // IIFE FTW : http://bit.ly/18MDRaF
                            dpd.companytouser.post(companytouser, function(result, status, headers, config) {
                                if (status < 400) {
                                    $log.log(result);
                                    var infoMessage = "Droits d'entreprise '" + company.name + "' mise à jour."
                                    $log.log(infoMessage);
                                    $scope.info = infoMessage;
                                } else {
                                    var errorMessage = "Erreur pendant la mise à jour des droits de l'entreprise " + company.name;
                                    $log.err(errorMessage);
                                    $scope.error(errorMessage);
                                }
                            });

                        })(company, companytouser);
                    } else {
                        $log.log("We are updating companytouser", companytouser);
                        dpd.companytouser.put(companytouser.id, companytouser, function(result, status, headers, config) {
                            if (status < 400) {
                                var infoMessage = "Droits d'entreprise '" + company.name + "' mise à jour."
                                $log.log(infoMessage);
                                $scope.info = infoMessage;
                            } else {
                                var errorMessage = "Erreur pendant la mise à jour des droits de l'entreprise " + company.name;
                                $log.err(errorMessage);
                                $scope.error(errorMessage);
                            }
                        });
                    }
                }

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, company, users) {
            $scope.company = company;
            $scope.company.users = users;

            $scope.ok = function () {
                $modalInstance.close($scope.company);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

    });
'use strict';

angular.module('KinoaApp')
    .controller('NewCompanyCtrl', function ($scope, $location, $log, CountryService, AuthService, CompaniesService) {

        $scope.creation = true;
        $scope.societe = {};

        $scope.countryList = CountryService.findAll();

        $scope.createCompany = function (newCompany) {
            var currentUser = AuthService.currentUser();
            $log.log("Create a company: ", newCompany);
            CompaniesService.createCompany(newCompany, currentUser).then(function(data) {
                $location.path("/societes/" + data.companyId);
            });
        }
    });
'use strict';

angular.module('KinoaApp')
    .controller('CompanyDetailsCtrl', function ($scope, $routeParams, $log, $http, dpd,
        CountryService, AuthService, ContactsService,
        _, CompaniesService, EnumService, $upload) {


        $scope.loading = "Chargement en cours, merci de patienter...";

        // Giving underscore to the scope
        $scope._ = _;

        // Initialize with default values
        $scope.anneeDepotReclam = 2014;
        $scope.countryList = CountryService.findAll();
        $scope.companyStatusList = EnumService.companyStatus;

        $scope.currentUser = AuthService.currentUser();

        $scope.civilities = EnumService.civilities;

        $scope.unassociatedContacts = [];

        // Get params
        var companyId = $routeParams.societeId;

        // Check the rights of the current user
        $scope.canWrite = false;
        if (AuthService.isAdmin()) {
            $scope.canWrite = true;
        } else {
            dpd.companytouser.get({companyId:companyId, userId: $scope.currentUser.id}, function(data) {
                $log.log("companyToUser: ", data);
                if (data && data[0].rightsLevel > 1) {
                    $scope.canWrite = true;
                }
            });
        }
        

        // Load data about this company
        CompaniesService.getCompany(companyId, $scope.currentUser.id).then(function(data) {
            $log.log("Societe chargée: ", data);
            $scope.societe = data;
            if (data.status) $scope.societe.statusToDisplay = EnumService.getCompanyStatus(data.status).french;
            delete $scope.loading;
        }, function(err) {
            $log.log(err);
            $scope.error = err;
            throw err;
        });


        // Load the todos for this company
        dpd.todos.get({companyId: companyId, includeAssignedUser: true, includeCreator: true}, function (data, status, headers, config) {
            $scope.todos = data;
        });

        // Load users for the todo
        dpd.users.get(function (data, status, headers, config) {
            $scope.users = data;
        });

        // load the contacts for this company
        $scope.associatedContacts = [];
        dpd.companytocontact.get({companyId: companyId}, function (data, status, headers, config) {
            for (var index in data) {
                var contactId = data[index].contactId;
                ContactsService.getContact(contactId).then(function(contact) {
                    $scope.associatedContacts.push(contact);
                });
            }
        });

        // load the taxes for this company
        $scope.associatedTaxes = [];
        dpd.companytotaxe.get({companyId: companyId}, function (data, status, headers, config) {
            for (var index in data) {
                dpd.taxes.get({id: data[index].taxeId}, function (data2, status, headers, config) {
                    $scope.associatedTaxes.push(data2);
                });
            }
        });

        // Load all the taxes
        $scope.unassociatedTaxes = [];
        dpd.taxes.get(function (data, status, headers, config) {
            $scope.taxes = data;

            // Load all the contacts not associated to this company
            angular.copy(data, $scope.unassociatedTaxes);
            dpd.companytotaxe.get({companyId: companyId}, function (data2, status, headers, config) {
                for (var i in data2) {
                    for (var index in $scope.unassociatedTaxes) {
                        if ($scope.unassociatedTaxes[index].id === data2[i].taxeId) {
                            $scope.unassociatedTaxes.splice(index, 1);
                        }
                    }
                }
            });
        });


        /** Functions **/


        $scope.searchUnassociatedContacts = function(filtreContacts) {
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
            ContactsService.searchContacts(filtre).then(function(result) {
                $log.log(result);
               $scope.unassociatedContacts = result;
            });
        }

        $scope.associateContact = function (contact) {
            $log.log("Associate a contact: ", contact);
            dpd.companytocontact.get({companyId: companyId, contactId: contact.id}, function (data, status, headers, config) {
                if (data == "") {
                    dpd.companytocontact.post({companyId: companyId, contactId: contact.id}, function (data2, status2, headers2, config2) {
                        $scope.associatedContacts.push(contact);
                        var index = $scope.unassociatedContacts.indexOf(contact);
                        $scope.unassociatedContacts.splice(index, 1);
                    });
                }
            });
        };

        $scope.desassociateContact = function (contact) {
            $log.log("Desassociate a contact: ", contact);
            dpd.companytocontact.get({companyId: companyId, contactId: contact.id}, function (data, status, headers, config) {
                dpd.companytocontact.del(data[0].id, function (data2, status2, headers2, config2) {
                    var index = $scope.associatedContacts.indexOf(contact);
                    $scope.associatedContacts.splice(index, 1);
                    $scope.unassociatedContacts.push(contact);
                });
            });
        };

        $scope.createAssociateContact = function (newcontact) {
            $log.log("Create and associate a contact: ", newcontact);
            dpd.contacts.post(newcontact, function (data, status, headers, config) {
                dpd.companytocontact.post({companyId: companyId, contactId: data.id}, function (data2, status2, headers2, config2) {
                    $scope.associatedContacts.push(data);
                    var index = $scope.unassociatedContacts.indexOf(data);
                    $scope.unassociatedContacts.splice(index, 1);
                    $scope.newcontact = {};
                });
            });
        };

        $scope.associateTaxe = function(taxe) {
            $log.log("Associate a taxe: ", taxe);
            dpd.companytotaxe.get({companyId: companyId, taxeId: taxe.id}, function (data, status, headers, config) {
                if (data) {
                    dpd.companytotaxe.post({companyId: companyId, taxeId: taxe.id}, function (data2, status2, headers2, config2) {
                        $scope.associatedTaxes.push(taxe);
                        var index = $scope.unassociatedTaxes.indexOf(taxe);
                        $scope.unassociatedTaxes.splice(index, 1);
                    });
                }
            });
        }

        $scope.desassociateTaxe = function (taxe) {
            $log.log("Desassociate a taxe: ", taxe);
            dpd.companytotaxe.get({companyId: companyId, taxeId: taxe.id}, function (data, status, headers, config) {
                dpd.companytotaxe.del(data[0].id, function (data2, status2, headers2, config2) {
                    var index = $scope.associatedTaxes.indexOf(taxe);
                    $scope.associatedTaxes.splice(index, 1);
                    $scope.unassociatedTaxes.push(taxe);
                });
            });
        };

        $scope.createAssociateTaxe = function(taxe) {
            $log.log("Create and associate a taxe: ", taxe);
            dpd.taxes.post(taxe, function (data, status, headers, config) {
                dpd.companytotaxe.post({companyId: companyId, taxeId: data.id}, function (data2, status2, headers2, config2) {
                    $scope.associatedTaxes.push(data);
                    var index = $scope.unassociatedTaxes.indexOf(data);
                    $scope.unassociatedTaxes.splice(index, 1);
                })
            })
        }

        $scope.updateCompany = function (company) {
            $log.log("Update a company: ", company);
            company.lastModification = new Date().getTime();
            CompaniesService.updateCompany(company).then(function(data) {
                var infoMessage = "Fiche entreprise " + data.name + " mise à jour."
                $log.log(infoMessage);
                $scope.info = infoMessage;
                $scope.societe.statusToDisplay = EnumService.getCompanyStatus(data.status).french;
            });
        }

        $scope.changeCompanyVip = function (isVip, company) {
            $log.log("Changing VIP status", company);
            if (_.isEmpty(company.companytouser)) {
                dpd.companytouser.post({
                    companyId: company.id,
                    userId: $scope.currentUser.id,
                    vip: isVip,
                    lastModification: new Date().getTime()
                }, function (data, status, headers, config) {
                    $scope.societe.companytouser = data;
                });
            } else {
                dpd.companytouser.put(company.companytouser.id, {lastModification: new Date().getTime(), vip: isVip}, function (data, status, headers, config) {
                    if (status < 400) {
                        var infoMessage = "Fiche entreprise " + $scope.societe.name + " mise à jour."
                        $log.log(infoMessage);
                        $scope.info = infoMessage;
                        $scope.societe.companytouser = data;
                    } else {
                        var errorMessage = "Erreur pendant la sauvegarde de l'entreprise " + $scope.societe.name;
                        $log.err(errorMessage);
                        $scope.error(errorMessage);
                    }
                });
            }
        }

        $scope.addTodo = function (newtodo) {
            $log.log("Create a todo: ", newtodo);
            dpd.todos.post({
                companyId: companyId,
                message: newtodo.message,
                status: '1',
                dueDate: newtodo.dueDate.getTime(),
                assignedId: newtodo.assignedId,
                creationDate: new Date().getTime(),
                lastModification: new Date().getTime()
            }, function (data, status, headers, config) {
                if (status >= 400) {
                    var errorMessage = "Erreur lors de la création de la tache " + newtodo.message;
                    $log.error(errorMessage);
                    $scope.error = errorMessage;
                }
            });
        };

        $scope.archiveTodo = function (todo) {
            todo.status = '0';
            todo.lastModification = new Date().getTime();
            dpd.todos.put(todo.id, todo, function (data, status, headers, config) {
                if (status < 400) {
                    //var index = $scope.todos.indexOf(todo);
                    //$scope.todos.splice(index, 1);
                } else {
                    var errorMessage = "Erreur lors de l'archivage de la tache " + todo.message;
                    $log.error(errorMessage);
                    $scope.error = errorMessage;
                }
            });
        };

        // File upload methods
        $scope.files = [];
        $scope.uploadedFiles = [];
        $scope.setFiles = function(element) {
            $scope.$apply(function(scope) {
                // Turn the FileList object into an Array
                scope.files = [];
                for (var i = 0; i < element.files.length; i++) {
                    scope.files.push(element.files[i]);
                }
            });
        };

        $scope.uploadMultipleFiles = function() {
            $scope.loading = "Envoi en cours, merci de patienter...";
            var formData = new FormData();
            for (var i in $scope.files) {
                formData.append($scope.files[i].name, $scope.files[i]);
            }
            $http({
                method: 'POST',
                url: '/upload',
                data: formData,
                params: {subdir: companyId, creator: $scope.currentUser},
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).success(function(data, status, headers, config) {
                if (status < 400) {
                    var infoMessage = "Fichiers correctement uploadés!";
                    delete $scope.loading;
                    $log.log(data);
                    $scope.info = infoMessage;
                    $scope.uploadedFiles = $scope.uploadedFiles.concat(data);


                    // Erase the input file field
                    angular.forEach(angular.element("input[type='file']"), function(inputElem) {
                        angular.element(inputElem).val(null);
                    });
                } else {
                    var errorMessage = "Erreur pendant l'upload des fichiers " + $scope.files.join(", ");
                    $log.err(errorMessage);
                    $scope.error(errorMessage);
                }
            });
        }

        $scope.onFileSelect = function($files) {
            
            $scope.loading = "Envoi en cours, merci de patienter...";
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/upload',
                    params: {
                        subdir: companyId,
                        creator: $scope.currentUser.id
                    },
                    file: file

                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    var infoMessage = "Fichiers correctement uploadés!";
                    delete $scope.loading;
                    $log.log(data);
                    $scope.info = infoMessage;
                    $scope.uploadedFiles = $scope.uploadedFiles.concat(data);
                });
            }
        };

        $scope.getUploadedFiles = function() {
            // Load uploaded files for this company
            dpd.upload.get({subdir: companyId}, function(data, status, headers, config) {
                $scope.uploadedFiles = data;

            });
        }

        // Load uploaded files
        $scope.getUploadedFiles();

        $scope.deleteUploadedFile = function(file) {
            var confirmDelete = confirm("Etes-vous sur de vouloir supprimer le fichier " + file.filename + " ?");
            if (confirmDelete) {
                dpd.upload.del(file.id, function(data, status, headers, config) {
                    if (status < 400) {
                        $scope.info = "Fichier " + file.filename + " correctement effacé";
                        var index = $scope.uploadedFiles.indexOf(file);
                        $scope.uploadedFiles.splice(index, 1);
                    } else {
                        var errorMessage = "Erreur lors de la suppression du fichier " + file.filename;
                        $log.err(errorMessage);
                        $scope.error(errorMessage);
                    }
                });
            }
        }
    });

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
'use strict';

angular.module('KinoaApp')
    .controller('HelpCtrl', function () {



    });
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

'use strict';

angular.module('KinoaApp')
    .controller('LogoutCtrl', function ($scope, $location, $log, AuthService) {

        AuthService.logout(function (result) {
            $scope.isLogged = false;
            $scope.user = null;
            $location.path("/login");
        }, function (err) {
            $log.error("Could not logout()");
        });
    });

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
  	


'use strict';

angular.module('KinoaApp')
    .controller('NewTaxeCtrl', function ($scope, dpd, $location, CountryService) {

        // Initialize Default values
        $scope.countryList = CountryService.findAll();
        $scope.creation = true;


        $scope.createTaxe = function (taxe) {
            dpd.taxes.post(taxe, function (result, err) {
                console.log(result.id);
                $location.path("/centreimpots/" + result.id);
            });
        };


    });

angular.module('KinoaApp')
    .directive('scrollfollow', function($window) {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var currentOffsetTop, getParentWidth, handleSnapping, headerOffsetTop, parent, placeholder, window;
                window = angular.element($window);
                parent = angular.element(el.parent());
                currentOffsetTop = el[0].getBoundingClientRect().top;
                headerOffsetTop = scope.$eval(attrs.scrollfollow) || 5;
                getParentWidth = function() {
                    var returnDigit;
                    returnDigit = function(val) {
                        var valMatch = val.match(/\d+/);
                        if (valMatch && valMatch.length > 0) {
                            return valMatch[0];
                        }
                    };
                    return returnDigit(parent.css("width")) - returnDigit(parent.css("padding-left")) - returnDigit(parent.css("padding-right"));
                };
                handleSnapping = function() {
                    var dynamicContent;
                    dynamicContent = $("#" + el.attr("id")).css("content");
                    if (dynamicContent !== "tablet" && window[0].scrollY > currentOffsetTop) {
                        el.addClass("scrollfollowing");
                        el.css({
                            position: "fixed",
                            top: headerOffsetTop + "px",
                            width: getParentWidth()
                        });
                        return el.next().css({
                            height: el[0].offsetHeight,
                            display: "block"
                        });
                    } else {
                        el.removeClass("scrollfollowing");
                        el.css({
                            position: "static",
                            width: getParentWidth()
                        });
                        return el.next().css({
                            "display": "none"
                        });
                    }
                };
                placeholder = document.createElement("div");
                placeholder.className = "scrollfollow_placeholder";
                placeholder.style.display = "none";
                el.after(placeholder);
                handleSnapping();
                window.bind("scroll", function() {
                    return handleSnapping();
                });
                return window.bind("resize", function() {
                    return el.css({
                        width: getParentWidth()
                    });
                });
            }
        };
    });

'use strict';

angular.module('KinoaApp')
    .filter('temp',function ($filter) {
        return function (input, precision) {
            if (!precision) {
                precision = 1;
            }
            var numberFilter = $filter('number');
            return numberFilter(input, precision) + '\u00B0C';
        };
    }).filter('capitalize', function () {
        return function (input, scope) {
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    }).filter('characters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length >= chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }else{
                    while(input.charAt(input.length-1) == ' '){
                        input = input.substr(0, input.length -1);
                    }
                }
                return input + '...';
            }
            return input;
        };
    }).filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }
            return input;
        };
    }).filter('bytes', function() {
        return function(bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }
});
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
'use strict';

angular.module('KinoaApp')
    .factory('CompaniesService', function ($http, $log, $q, _) {
        var companiesEndpoint = '/companies/';
        var companyToUserEndpoint = '/companytouser/';


        var getAllCompanies = function(params) {
            params = (typeof params === "undefined") ? "{}" : encodeURI(JSON.stringify(params));
            var deferred = $q.defer();
            $log.log(params);
            $http.get(companiesEndpoint + '?'+ params).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("Une erreur s'est produite en récupérant les societes.");
            });
            return deferred.promise;
        }

        var getCompany = function(companyId, userId) {
            var deferred = $q.defer();
            $http.get(companiesEndpoint + companyId).success(function(data) {
                if (userId) {
                    var params = encodeURI(JSON.stringify({companyId: companyId, userId: userId}));
                    $http.get(companyToUserEndpoint + '?' + params).success(function(companytouser) {
                        data.companytouser = companytouser[0];
                        deferred.resolve(data);
                    });
                } else {
                    deferred.resolve(data);
                }
            }).error(function(data, status, headers, config) {
                if (status === 404) {
                    deferred.reject("La societe avec l'id " + companyId + " n'existe pas.");
                } else {
                    deferred.reject("Une erreur s'est produite en récupérant la societe.");
                }
            });
            return deferred.promise;
        }

        var updateCompany = function(company) {
            var deferred = $q.defer();
            $http.put(companiesEndpoint + company.id, company).success(function(data) {
                $log.log(data);
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("Une erreur s'est produite en voulant mettre à jour la societe.");
            });
            return deferred.promise;
        }

        var createCompany = function(company, user) {
            var deferred = $q.defer();
            $http.post(companiesEndpoint, company).success(function(companyResponse) {

                var companytouser = {
                    companyId: companyResponse.id,
                    userId: user.id,
                    rightsLevel: 2
                }

                $http.post(companyToUserEndpoint, companytouser).success(function(companytouserResponse) {
                    deferred.resolve(companytouserResponse);
                }).error(function() {
                    deferred.reject("Une erreur s'est produite en voulant ajouter la societe et son association.");
                });
            }).error(function() {
                deferred.reject("Une erreur s'est produite en voulant ajouter la societe.");
            });
            return deferred.promise;
        }

        var deleteCompany = function(companyId) {
            $log.log(companyId);
            var deferred = $q.defer();
            $http.delete(companiesEndpoint + companyId).success(function(companyResponse) {
                deferred.resolve(companyResponse);
            }).error(function() {
                deferred.reject("Une erreur s'est produite en voulant supprimer la societe.");
            });
            return deferred.promise;
        }

        var getCompanyToUser = function(user, company) {
            var deferred = $q.defer();
            $log.log(user, company);
            var params = encodeURI(JSON.stringify({companyId: company.id, userId: user.id}));
            $http.get(companyToUserEndpoint + '?' + params).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject("Une erreur s'est produite en récupérant la societe.");
            });
            return deferred.promise;
        }

        var createCompanytouser = function(companytouser) {
            var deferred = $q.defer();
            $http.post(companyToUserEndpoint, companytouser).success(function(companytouserResponse) {
                deferred.resolve(companytouserResponse);
            }).error(function() {
                deferred.reject("Une erreur s'est produite en voulant ajouter la companytouser.");
            });
            return deferred.promise;
        }

        var updateCompanytouser = function(companytouser) {
            var deferred = $q.defer();
            $log.log(companytouser);
            $http.put(companyToUserEndpoint + companytouser.id, companytouser).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject("Une erreur s'est produite en voulant mettre à jour la companytouser.");
            });
            return deferred.promise;
        }

        // Public methods
        return {
            getCompany: getCompany,
            getAllCompanies: getAllCompanies,
            updateCompany: updateCompany,
            createCompany: createCompany,
            deleteCompany: deleteCompany,
            getCompanyToUser: getCompanyToUser,
            createCompanytouser: createCompanytouser,
            updateCompanytouser: updateCompanytouser
        }
    });


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
'use strict';

angular.module('KinoaApp')
    .factory('CountryService', function () {
        var countryList = [
            {
                "iso": "AF",
                "name": "Afghanistan"
            },
            {
                "iso": "ZA",
                "name": "Afrique du Sud"
            },
            {
                "iso": "AL",
                "name": "Albanie"
            },
            {
                "iso": "DZ",
                "name": "Algérie"
            },
            {
                "iso": "DE",
                "name": "Allemagne"
            },
            {
                "iso": "AD",
                "name": "Andorre"
            },
            {
                "iso": "AO",
                "name": "Angola"
            },
            {
                "iso": "AI",
                "name": "Anguilla"
            },
            {
                "iso": "AQ",
                "name": "Antarctique"
            },
            {
                "iso": "AG",
                "name": "Antigua-et-Barbuda"
            },
            {
                "iso": "AN",
                "name": "Antilles néerlandaises"
            },
            {
                "iso": "SA",
                "name": "Arabie saoudite"
            },
            {
                "iso": "AR",
                "name": "Argentine"
            },
            {
                "iso": "AM",
                "name": "Arménie"
            },
            {
                "iso": "AW",
                "name": "Aruba"
            },
            {
                "iso": "AU",
                "name": "Australie"
            },
            {
                "iso": "AT",
                "name": "Autriche"
            },
            {
                "iso": "AZ",
                "name": "Azerbaïdjan"
            },
            {
                "iso": "BS",
                "name": "Bahamas"
            },
            {
                "iso": "BH",
                "name": "Bahreïn"
            },
            {
                "iso": "BD",
                "name": "Bangladesh"
            },
            {
                "iso": "BB",
                "name": "Barbade"
            },
            {
                "iso": "BE",
                "name": "Belgique"
            },
            {
                "iso": "BZ",
                "name": "Belize"
            },
            {
                "iso": "BM",
                "name": "Bermudes"
            },
            {
                "iso": "BT",
                "name": "Bhoutan"
            },
            {
                "iso": "BO",
                "name": "Bolivie"
            },
            {
                "iso": "BA",
                "name": "Bosnie-Herzégovine"
            },
            {
                "iso": "BW",
                "name": "Botswana"
            },
            {
                "iso": "BN",
                "name": "Brunéi Darussalam"
            },
            {
                "iso": "BR",
                "name": "Brésil"
            },
            {
                "iso": "BG",
                "name": "Bulgarie"
            },
            {
                "iso": "BF",
                "name": "Burkina Faso"
            },
            {
                "iso": "BI",
                "name": "Burundi"
            },
            {
                "iso": "BY",
                "name": "Bélarus"
            },
            {
                "iso": "BJ",
                "name": "Bénin"
            },
            {
                "iso": "KH",
                "name": "Cambodge"
            },
            {
                "iso": "CM",
                "name": "Cameroun"
            },
            {
                "iso": "CA",
                "name": "Canada"
            },
            {
                "iso": "CV",
                "name": "Cap-Vert"
            },
            {
                "iso": "CL",
                "name": "Chili"
            },
            {
                "iso": "CN",
                "name": "Chine"
            },
            {
                "iso": "CY",
                "name": "Chypre"
            },
            {
                "iso": "CO",
                "name": "Colombie"
            },
            {
                "iso": "KM",
                "name": "Comores"
            },
            {
                "iso": "CG",
                "name": "Congo"
            },
            {
                "iso": "KP",
                "name": "Corée du Nord"
            },
            {
                "iso": "KR",
                "name": "Corée du Sud"
            },
            {
                "iso": "CR",
                "name": "Costa Rica"
            },
            {
                "iso": "HR",
                "name": "Croatie"
            },
            {
                "iso": "CU",
                "name": "Cuba"
            },
            {
                "iso": "CI",
                "name": "Côte d’Ivoire"
            },
            {
                "iso": "DK",
                "name": "Danemark"
            },
            {
                "iso": "DJ",
                "name": "Djibouti"
            },
            {
                "iso": "DM",
                "name": "Dominique"
            },
            {
                "iso": "SV",
                "name": "El Salvador"
            },
            {
                "iso": "ES",
                "name": "Espagne"
            },
            {
                "iso": "EE",
                "name": "Estonie"
            },
            {
                "iso": "FJ",
                "name": "Fidji"
            },
            {
                "iso": "FI",
                "name": "Finlande"
            },
            {
                "iso": "FR",
                "name": "France"
            },
            {
                "iso": "GA",
                "name": "Gabon"
            },
            {
                "iso": "GM",
                "name": "Gambie"
            },
            {
                "iso": "GH",
                "name": "Ghana"
            },
            {
                "iso": "GI",
                "name": "Gibraltar"
            },
            {
                "iso": "GD",
                "name": "Grenade"
            },
            {
                "iso": "GL",
                "name": "Groenland"
            },
            {
                "iso": "GR",
                "name": "Grèce"
            },
            {
                "iso": "GP",
                "name": "Guadeloupe"
            },
            {
                "iso": "GU",
                "name": "Guam"
            },
            {
                "iso": "GT",
                "name": "Guatemala"
            },
            {
                "iso": "GG",
                "name": "Guernesey"
            },
            {
                "iso": "GN",
                "name": "Guinée"
            },
            {
                "iso": "GQ",
                "name": "Guinée équatoriale"
            },
            {
                "iso": "GW",
                "name": "Guinée-Bissau"
            },
            {
                "iso": "GY",
                "name": "Guyana"
            },
            {
                "iso": "GF",
                "name": "Guyane française"
            },
            {
                "iso": "GE",
                "name": "Géorgie"
            },
            {
                "iso": "GS",
                "name": "Géorgie du Sud et les îles Sandwich du Sud"
            },
            {
                "iso": "HT",
                "name": "Haïti"
            },
            {
                "iso": "HN",
                "name": "Honduras"
            },
            {
                "iso": "HU",
                "name": "Hongrie"
            },
            {
                "iso": "IN",
                "name": "Inde"
            },
            {
                "iso": "ID",
                "name": "Indonésie"
            },
            {
                "iso": "IQ",
                "name": "Irak"
            },
            {
                "iso": "IR",
                "name": "Iran"
            },
            {
                "iso": "IE",
                "name": "Irlande"
            },
            {
                "iso": "IS",
                "name": "Islande"
            },
            {
                "iso": "IL",
                "name": "Israël"
            },
            {
                "iso": "IT",
                "name": "Italie"
            },
            {
                "iso": "JM",
                "name": "Jamaïque"
            },
            {
                "iso": "JP",
                "name": "Japon"
            },
            {
                "iso": "JE",
                "name": "Jersey"
            },
            {
                "iso": "JO",
                "name": "Jordanie"
            },
            {
                "iso": "KZ",
                "name": "Kazakhstan"
            },
            {
                "iso": "KE",
                "name": "Kenya"
            },
            {
                "iso": "KG",
                "name": "Kirghizistan"
            },
            {
                "iso": "KI",
                "name": "Kiribati"
            },
            {
                "iso": "KW",
                "name": "Koweït"
            },
            {
                "iso": "LA",
                "name": "Laos"
            },
            {
                "iso": "LS",
                "name": "Lesotho"
            },
            {
                "iso": "LV",
                "name": "Lettonie"
            },
            {
                "iso": "LB",
                "name": "Liban"
            },
            {
                "iso": "LY",
                "name": "Libye"
            },
            {
                "iso": "LR",
                "name": "Libéria"
            },
            {
                "iso": "LI",
                "name": "Liechtenstein"
            },
            {
                "iso": "LT",
                "name": "Lituanie"
            },
            {
                "iso": "LU",
                "name": "Luxembourg"
            },
            {
                "iso": "MK",
                "name": "Macédoine"
            },
            {
                "iso": "MG",
                "name": "Madagascar"
            },
            {
                "iso": "MY",
                "name": "Malaisie"
            },
            {
                "iso": "MW",
                "name": "Malawi"
            },
            {
                "iso": "MV",
                "name": "Maldives"
            },
            {
                "iso": "ML",
                "name": "Mali"
            },
            {
                "iso": "MT",
                "name": "Malte"
            },
            {
                "iso": "MA",
                "name": "Maroc"
            },
            {
                "iso": "MQ",
                "name": "Martinique"
            },
            {
                "iso": "MU",
                "name": "Maurice"
            },
            {
                "iso": "MR",
                "name": "Mauritanie"
            },
            {
                "iso": "YT",
                "name": "Mayotte"
            },
            {
                "iso": "MX",
                "name": "Mexique"
            },
            {
                "iso": "MD",
                "name": "Moldavie"
            },
            {
                "iso": "MC",
                "name": "Monaco"
            },
            {
                "iso": "MN",
                "name": "Mongolie"
            },
            {
                "iso": "MS",
                "name": "Montserrat"
            },
            {
                "iso": "ME",
                "name": "Monténégro"
            },
            {
                "iso": "MZ",
                "name": "Mozambique"
            },
            {
                "iso": "MM",
                "name": "Myanmar"
            },
            {
                "iso": "NA",
                "name": "Namibie"
            },
            {
                "iso": "NR",
                "name": "Nauru"
            },
            {
                "iso": "NI",
                "name": "Nicaragua"
            },
            {
                "iso": "NE",
                "name": "Niger"
            },
            {
                "iso": "NG",
                "name": "Nigéria"
            },
            {
                "iso": "NU",
                "name": "Niue"
            },
            {
                "iso": "NO",
                "name": "Norvège"
            },
            {
                "iso": "NC",
                "name": "Nouvelle-Calédonie"
            },
            {
                "iso": "NZ",
                "name": "Nouvelle-Zélande"
            },
            {
                "iso": "NP",
                "name": "Népal"
            },
            {
                "iso": "OM",
                "name": "Oman"
            },
            {
                "iso": "UG",
                "name": "Ouganda"
            },
            {
                "iso": "UZ",
                "name": "Ouzbékistan"
            },
            {
                "iso": "PK",
                "name": "Pakistan"
            },
            {
                "iso": "PW",
                "name": "Palaos"
            },
            {
                "iso": "PA",
                "name": "Panama"
            },
            {
                "iso": "PG",
                "name": "Papouasie-Nouvelle-Guinée"
            },
            {
                "iso": "PY",
                "name": "Paraguay"
            },
            {
                "iso": "NL",
                "name": "Pays-Bas"
            },
            {
                "iso": "PH",
                "name": "Philippines"
            },
            {
                "iso": "PN",
                "name": "Pitcairn"
            },
            {
                "iso": "PL",
                "name": "Pologne"
            },
            {
                "iso": "PF",
                "name": "Polynésie française"
            },
            {
                "iso": "PR",
                "name": "Porto Rico"
            },
            {
                "iso": "PT",
                "name": "Portugal"
            },
            {
                "iso": "PE",
                "name": "Pérou"
            },
            {
                "iso": "QA",
                "name": "Qatar"
            },
            {
                "iso": "HK",
                "name": "R.A.S. chinoise de Hong Kong"
            },
            {
                "iso": "MO",
                "name": "R.A.S. chinoise de Macao"
            },
            {
                "iso": "RO",
                "name": "Roumanie"
            },
            {
                "iso": "GB",
                "name": "Royaume-Uni"
            },
            {
                "iso": "RU",
                "name": "Russie"
            },
            {
                "iso": "RW",
                "name": "Rwanda"
            },
            {
                "iso": "CF",
                "name": "République centrafricaine"
            },
            {
                "iso": "DO",
                "name": "République dominicaine"
            },
            {
                "iso": "CD",
                "name": "République démocratique du Congo"
            },
            {
                "iso": "CZ",
                "name": "République tchèque"
            },
            {
                "iso": "RE",
                "name": "Réunion"
            },
            {
                "iso": "EH",
                "name": "Sahara occidental"
            },
            {
                "iso": "BL",
                "name": "Saint-Barthélémy"
            },
            {
                "iso": "KN",
                "name": "Saint-Kitts-et-Nevis"
            },
            {
                "iso": "SM",
                "name": "Saint-Marin"
            },
            {
                "iso": "MF",
                "name": "Saint-Martin"
            },
            {
                "iso": "PM",
                "name": "Saint-Pierre-et-Miquelon"
            },
            {
                "iso": "VC",
                "name": "Saint-Vincent-et-les Grenadines"
            },
            {
                "iso": "SH",
                "name": "Sainte-Hélène"
            },
            {
                "iso": "LC",
                "name": "Sainte-Lucie"
            },
            {
                "iso": "WS",
                "name": "Samoa"
            },
            {
                "iso": "AS",
                "name": "Samoa américaines"
            },
            {
                "iso": "ST",
                "name": "Sao Tomé-et-Principe"
            },
            {
                "iso": "RS",
                "name": "Serbie"
            },
            {
                "iso": "CS",
                "name": "Serbie-et-Monténégro"
            },
            {
                "iso": "SC",
                "name": "Seychelles"
            },
            {
                "iso": "SL",
                "name": "Sierra Leone"
            },
            {
                "iso": "SG",
                "name": "Singapour"
            },
            {
                "iso": "SK",
                "name": "Slovaquie"
            },
            {
                "iso": "SI",
                "name": "Slovénie"
            },
            {
                "iso": "SO",
                "name": "Somalie"
            },
            {
                "iso": "SD",
                "name": "Soudan"
            },
            {
                "iso": "LK",
                "name": "Sri Lanka"
            },
            {
                "iso": "CH",
                "name": "Suisse"
            },
            {
                "iso": "SR",
                "name": "Suriname"
            },
            {
                "iso": "SE",
                "name": "Suède"
            },
            {
                "iso": "SJ",
                "name": "Svalbard et Île Jan Mayen"
            },
            {
                "iso": "SZ",
                "name": "Swaziland"
            },
            {
                "iso": "SY",
                "name": "Syrie"
            },
            {
                "iso": "SN",
                "name": "Sénégal"
            },
            {
                "iso": "TJ",
                "name": "Tadjikistan"
            },
            {
                "iso": "TZ",
                "name": "Tanzanie"
            },
            {
                "iso": "TW",
                "name": "Taïwan"
            },
            {
                "iso": "TD",
                "name": "Tchad"
            },
            {
                "iso": "TF",
                "name": "Terres australes françaises"
            },
            {
                "iso": "IO",
                "name": "Territoire britannique de l'océan Indien"
            },
            {
                "iso": "PS",
                "name": "Territoire palestinien"
            },
            {
                "iso": "TH",
                "name": "Thaïlande"
            },
            {
                "iso": "TL",
                "name": "Timor oriental"
            },
            {
                "iso": "TG",
                "name": "Togo"
            },
            {
                "iso": "TK",
                "name": "Tokelau"
            },
            {
                "iso": "TO",
                "name": "Tonga"
            },
            {
                "iso": "TT",
                "name": "Trinité-et-Tobago"
            },
            {
                "iso": "TN",
                "name": "Tunisie"
            },
            {
                "iso": "TM",
                "name": "Turkménistan"
            },
            {
                "iso": "TR",
                "name": "Turquie"
            },
            {
                "iso": "TV",
                "name": "Tuvalu"
            },
            {
                "iso": "UA",
                "name": "Ukraine"
            },
            {
                "iso": "UY",
                "name": "Uruguay"
            },
            {
                "iso": "VU",
                "name": "Vanuatu"
            },
            {
                "iso": "VE",
                "name": "Venezuela"
            },
            {
                "iso": "VN",
                "name": "Viêt Nam"
            },
            {
                "iso": "WF",
                "name": "Wallis-et-Futuna"
            },
            {
                "iso": "YE",
                "name": "Yémen"
            },
            {
                "iso": "ZM",
                "name": "Zambie"
            },
            {
                "iso": "ZW",
                "name": "Zimbabwe"
            },
            {
                "iso": "ZZ",
                "name": "région indéterminée"
            },
            {
                "iso": "EG",
                "name": "Égypte"
            },
            {
                "iso": "AE",
                "name": "Émirats arabes unis"
            },
            {
                "iso": "EC",
                "name": "Équateur"
            },
            {
                "iso": "ER",
                "name": "Érythrée"
            },
            {
                "iso": "VA",
                "name": "État de la Cité du Vatican"
            },
            {
                "iso": "FM",
                "name": "États fédérés de Micronésie"
            },
            {
                "iso": "US",
                "name": "États-Unis"
            },
            {
                "iso": "ET",
                "name": "Éthiopie"
            },
            {
                "iso": "BV",
                "name": "Île Bouvet"
            },
            {
                "iso": "CX",
                "name": "Île Christmas"
            },
            {
                "iso": "NF",
                "name": "Île Norfolk"
            },
            {
                "iso": "IM",
                "name": "Île de Man"
            },
            {
                "iso": "KY",
                "name": "Îles Caïmans"
            },
            {
                "iso": "CC",
                "name": "Îles Cocos - Keeling"
            },
            {
                "iso": "CK",
                "name": "Îles Cook"
            },
            {
                "iso": "FO",
                "name": "Îles Féroé"
            },
            {
                "iso": "HM",
                "name": "Îles Heard et MacDonald"
            },
            {
                "iso": "FK",
                "name": "Îles Malouines"
            },
            {
                "iso": "MP",
                "name": "Îles Mariannes du Nord"
            },
            {
                "iso": "MH",
                "name": "Îles Marshall"
            },
            {
                "iso": "UM",
                "name": "Îles Mineures Éloignées des États-Unis"
            },
            {
                "iso": "SB",
                "name": "Îles Salomon"
            },
            {
                "iso": "TC",
                "name": "Îles Turks et Caïques"
            },
            {
                "iso": "VG",
                "name": "Îles Vierges britanniques"
            },
            {
                "iso": "VI",
                "name": "Îles Vierges des États-Unis"
            },
            {
                "iso": "AX",
                "name": "Îles Åland"
            }
        ];

        // Public API here
        return {
            findAll: function () {
                return countryList;
            },
            getNameFromIso: function (iso) {
                for (i = 0; i < countryList.length; i++) {
                    if (countryList[i]["iso"] === iso) {
                        return countryList[i];
                    }
                }
                return undefined;

            }
        };
    });

'use strict';

angular.module('KinoaApp')
    .factory('EnumService', function (_) {

        var companyStatus = [
            {
                id: 0,
                name: 'prospect',
                french: 'prospect'
            },
            {
                id: 1,
                name: 'progress',
                french: 'étude en cours'
            },
            {
                id:2,
                name: 'dossier à reprendre ultérieurement',
                french: 'dossier à reprendre ultérieurement'
            },
            {
                id:3,
                name: 'dégrèvements obtenus',
                french: 'dégrèvements obtenus'
            },
            {
                id:4,
                name: 'rejet',
                french: 'rejet'
            },
            {
                id:5,
                name: 'réclamation envoyée',
                french: 'réclamation envoyée'
            },
            {
                id:6,
                name: 'refus commercial',
                french: 'refus commercial'
            },
            {
                id:7,
                name: 'dossier zéro',
                french: 'dossier zéro'
            },
            {
                id:8,
                name: 'stand by risqué',
                french: 'stand by risqué'
            },
            {
                id: 9,
                name: 'archived',
                french: 'archivé'
            },
            {
                id:10,
                name: 'stand by taxes faibles',
                french: 'stand by taxes faibles'
            },
            {
                id:11,
                name: 'facture_etablie',
                french: 'facture établie'
            },
            {
                id:12,
                name: 'doublon autre client',
                french: 'doublon autre client'
            }
        ];

        var getCompanyStatus = function(statusId) {
            return _.where(companyStatus, {id: statusId})[0];
        }

        var civilities = [
            {
                id: 'madame',
                name: 'Madame'
            },
            {
                id: 'monsieur',
                name: 'Monsieur',

            }
        ]

        return {
            companyStatus: companyStatus,
            getCompanyStatus: getCompanyStatus,
            civilities: civilities
        }


    });
'use strict';

angular.module('KinoaApp')
    .directive('ngFooter', function () {
        return {
            templateUrl: 'app/shared/directives/footer/footer.html',
            restrict: 'E'
        };
    });

'use strict';

angular.module('KinoaApp')
    .directive('ngHeader', function (AuthService, $location, $log, $translate) {
        return {
            templateUrl: 'app/shared/directives/header/header.html',
            restrict: 'E',
            link: function (scope, elem, attrs) {
                scope.isLogged = AuthService.isLogged();
                scope.user = AuthService.currentUser();
                scope.isAdmin = AuthService.isAdmin();
                scope.changeLanguage = function(language) {
                    $translate.use(language);
                }
            }
        };
    });

'use strict';

angular.module('KinoaApp')
    .directive('ngSidebar', function (AuthService, dpd, $log, ContactsService, CompaniesService, $location) {
        return {
            templateUrl: 'app/shared/directives/sidebar/sidebar.html',
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
