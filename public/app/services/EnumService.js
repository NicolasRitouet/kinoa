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