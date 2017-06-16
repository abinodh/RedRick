(function () {
    'use strict';

    angular
        .module('redrickApp', ['ngRoute', 'ngCookies'])
        .config(config).constant('config', {
		            appName : 'redrickApp',
		            appVersion : '0.0.1'
		            //api : 'https://abinodh.com/api'
	       })
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');
        $routeProvider
            .when('/home', {
                controller: 'HomeController',
                templateUrl: 'views/home.view.html',
                controllerAs: 'redrick'
            })

            .otherwise({ redirectTo: '/home' });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http', '$document'];
    function run($rootScope, $location, $cookies, $http, $document) {
        // keep user logged in after page refresh

    }

})();