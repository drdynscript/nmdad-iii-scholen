'use strict';

angular.module('ddsApp.controllers', []);
angular.module('ddsApp.services', []);
angular.module('ddsApp.directives', []);

angular.module('ddsApp', [
    'ngRoute',
    'ngResource',
    'ddsApp.controllers',
    'ddsApp.services',
    'ddsApp.directives'
])
.config(['$routeProvider','$locationProvider', '$httpProvider',function($routeProvider, $locationProvider, $httpProvider){
       $httpProvider.defaults.useXDomain = true;//Cross Domain Calls --> Ok Ready

        $routeProvider.when('/', {templateUrl:'views/main.html', controller:'ddsApp.controllers.MainCtrl'});
        $routeProvider.when('/todo', {templateUrl:'views/todo.html', controller:'ddsApp.controllers.ToDoCtrl'});
        $routeProvider.when('/basisscholen', {templateUrl:'views/basisscholen.html', controller:'ddsApp.controllers.BasisscholenCtrl'});
        $routeProvider.when('/secundairescholen', {templateUrl:'views/secundairescholen.html', controller:'ddsApp.controllers.SecundairescholenCtrl'});
        $routeProvider.when('/favorieten', {templateUrl:'views/favorieten.html', controller:'ddsApp.controllers.FavorietenCtrl'});
        $routeProvider.when('/about', {templateUrl:'views/about.html', controller:'ddsApp.controllers.AboutCtrl'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);