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