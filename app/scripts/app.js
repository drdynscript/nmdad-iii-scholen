'use strict';

angular.module('ddsApp.controllers', []);
angular.module('ddsApp.services', []);
angular.module('ddsApp.directives', []);

var app = angular.module('ddsApp', [
    'ngRoute',
    'ngResource',
    'ddsApp.controllers',
    'ddsApp.services',
    'ddsApp.directives'
])
.config(['$routeProvider','$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
        $httpProvider.defaults.useXDomain = true;//Cross Domain Calls --> Ok Ready
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $routeProvider.when('/', {templateUrl:'views/main.html', controller:'ddsApp.controllers.MainCtrl'});
        $routeProvider.when('/todo', {templateUrl:'views/todo.html', controller:'ddsApp.controllers.ToDoCtrl'});
        $routeProvider.when('/basisscholen', {
            templateUrl:'views/basisscholen.html',
            controller:'ddsApp.controllers.BasisscholenCtrl',
            resolve: {
                basisscholen: appCtrl.getDataBasisscholen
            }
        });
        $routeProvider.when('/secundairescholen', {templateUrl:'views/secundairescholen.html', controller:'ddsApp.controllers.SecundairescholenCtrl'});
        $routeProvider.when('/favorieten', {templateUrl:'views/favorieten.html', controller:'ddsApp.controllers.FavorietenCtrl'});
        $routeProvider.when('/about', {templateUrl:'views/about.html', controller:'ddsApp.controllers.AboutCtrl'});
        $routeProvider.when('/app', {
            templateUrl:'views/app.html',
            controller:'AppCtrl',
            resolve: {
                appInitialized: appCtrl.loadData
            }
        });
        $routeProvider.otherwise({redirectTo: '/'});
    }])
.run(['$rootScope', '$timeout', '$location', 'ddsApp.services.ScholenSrvc',function($rootScope, $timeout, $location, ScholenSrvc){
        $rootScope.appInitialized = false;

        $rootScope.$on('$routeChangeStart', function(event, next, current){
           if(!$rootScope.appInitialized){
               $location.path('/app');
           }else if($rootScope.appInitialized && $location.path() === '/app'){
               $location.path('/');
           }
        })
    }]);

/*
    AppCtrl
    =======
    Controller for the App
    ----------------------
    * Load Data Via the services
    * Return the promises
    * Resolve for each route
*/
var appCtrl = app.controller('AppCtrl', ['$scope', '$location', 'appInitialized', function($scope, $location, appInitialized){
    if(appInitialized){
        $location.path('/');
    }
}]);

appCtrl.loadData = ['$rootScope', '$q', '$timeout', 'ddsApp.services.ScholenSrvc', function($rootScope, $q, $timeout, ScholenSrvc){
    var deferred = $q.defer();

    ScholenSrvc.loadData().then(
        function(data){
            $timeout(function(){
                $rootScope.appInitialized = true;
                deferred.resolve(data);
            },2000);
        },
        function(error){
            deferred.reject(error);
        }
    );

    return deferred.promise;
}];

appCtrl.getAmountOfScholenPerType = ['$q', 'ddsApp.services.ScholenSrvc', function($q, ScholenSrvc){

}];

appCtrl.getDataBasisscholen = ['$q', 'ddsApp.services.ScholenSrvc', function($q, ScholenSrvc){
    var deferred = $q.defer();

    ScholenSrvc.getDataBasisscholen().then(
        function(data){
            deferred.resolve(data);
        },
        function(error){
            deferred.reject(error);
        }
    );

    return deferred.promise;
}];
