'use strict';

angular.module('KinoaApp')
    .controller('CompanyDetailsCtrl', function ($scope, $routeParams, $log, $http, dpd, CountryService, AuthService, ContactsService, _, CompaniesService, EnumService) {


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
            $scope.societe.statusToDisplay = EnumService.getCompanyStatus(data.status).french;
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
