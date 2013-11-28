'use strict';

angular.module('LocalStorageModule').value('prefix', 'dds_scholen');

angular.module('ddsApp.controllers', []);
angular.module('ddsApp.services', []);
angular.module('ddsApp.directives', []);

var app = angular.module('ddsApp', [
    'ngRoute',
    'ngResource',
    'ddsApp.controllers',
    'ddsApp.services',
    'ddsApp.directives',
    'LocalStorageModule'
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
        $routeProvider.when('/basisscholen/:schoolId', {
            templateUrl:'views/basisschool.html',
            controller:'ddsApp.controllers.BasisschoolCtrl',
            resolve: {
                basisscholen: appCtrl.getDataBasisscholen
            }
        });
        $routeProvider.when('/secundairescholen', {
            templateUrl:'views/secundairescholen.html',
            controller:'ddsApp.controllers.SecundairescholenCtrl',
            resolve: {
                secundairescholen: appCtrl.getDataSecundairescholen
            }
        });
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
        });
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

appCtrl.getDataSecundairescholen = ['$q', 'ddsApp.services.ScholenSrvc', function($q, ScholenSrvc){
    var deferred = $q.defer();

    ScholenSrvc.getDataSecundairescholen().then(
        function(data){
            deferred.resolve(data);
        },
        function(error){
            deferred.reject(error);
        }
    );

    return deferred.promise;
}];

(function(){
    'use strict';
    var directives = angular.module('ddsApp.directives');

    directives.directive('leafletmanyplaces',
        function($window){
            return {
                restrict: 'E',
                transclude: true,
                require: '^lflPlaces',
                scope:{
                    lflPlaces: '=',
                    lflRefresh: '='
                },
                link: function mapLink (scope, element, attrs) {
                    var schoolIcon = L.icon({
                        iconUrl: 'content/images/school_marker.png',
                        iconRetinaUrl: 'content/images/school_marker.png',
                        iconSize: [32, 37],
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37],
                        shadowUrl: 'content/images/school_marker.png',
                        shadowRetinaUrl: 'content/images/school_marker.png',
                        shadowSize: [32, 37],
                        shadowAnchor: [16, 37]
                    });

                    element.addClass('leaflet-holder');
                    scope.map = new L.Map(element[0], {
                        scrollWheelZoom: false
                    });
                    scope.map.setView([51.053319, 3.730274], 14);
                    scope.layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data © OpenStreetMap contributors'
                    }).addTo(scope.map);

                    scope.$watch('lflPlaces', function(newVal, oldVal) {
                        var val = oldVal;
                        if(newVal){
                            val = newVal;
                        }
                        if(val){
                            scope.map.setView(new L.LatLng(51.053319, 3.730274), 14);
                            if(scope.markers){
                                angular.forEach(scope.markers, function(marker, key){
                                    scope.map.removeLayer(marker);
                                });
                            }

                            scope.markers = [];
                            angular.forEach(val, function(place, key){
                                scope.markers.push(new L.marker(new L.LatLng(place.lat, place.lng),{icon:schoolIcon}).addTo(scope.map)
                                    .bindPopup(place.dsc));
                            });

                            L.Util.requestAnimFrame(scope.map.invalidateSize,scope.map,false,scope.map._container);
                        }
                    });

                    angular.element($window).bind('resize', function () {
                        scope.$apply();
                        L.Util.requestAnimFrame(scope.map.invalidateSize,scope.map,false,scope.map._container);
                    });

                    scope.$watch('lflRefresh', function(oldVal, newVal) {
                        scope.map.invalidateSize(false);
                    });

                    scope.map.invalidateSize(false);

                    scope.$broadcast('mapAvailable', scope.map);
                }
            };
        }
    );

    directives.directive('lflPlaces', function() {
        return {
            controller: function($scope) {}
        };
    });

    directives.directive('lflRefresh', function() {
        return {
            controller: function($scope) {}
        };
    });

})();
(function(){
    'use strict';
    var directives = angular.module('ddsApp.directives');

    directives.directive('leafletoneplace',
        function(){
            return {
                restrict: 'E',
                transclude: true,
                require: '^lflPlace',
                scope:{
                    lflPlace: '='
                },
                link: function mapLink (scope, element, attrs) {
                    var schoolIcon = L.icon({
                        iconUrl: 'content/images/school_marker.png',
                        iconRetinaUrl: 'content/images/school_marker.png',
                        iconSize: [32, 37],
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37],
                        shadowUrl: 'content/images/school_marker.png',
                        shadowRetinaUrl: 'content/images/school_marker.png',
                        shadowSize: [32, 37],
                        shadowAnchor: [16, 37]
                    });
                    element.addClass('leaflet-holder');
                    scope.map = new L.Map(element[0], {
                        scrollWheelZoom: false
                    });
                    new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data Â© OpenStreetMap contributors'
                    }).addTo(scope.map);

                    scope.$watch('lflPlace', function(oldVal, newVal) {
                        var val = oldVal;
                        if(newVal){
                            val = newVal;
                        }
                        if(val){
                            scope.map.setView(new L.LatLng(val.lat, val.lng), val.zoom || 10);
                            scope.marker = new L.marker(new L.LatLng(val.lat, val.lng), {icon:schoolIcon}).addTo(scope.map)
                                .bindPopup(val.dsc)
                                .openPopup();
                        }
                    });

                    scope.$broadcast('mapAvailable', scope.map);
                }
            };
        }
    );

    directives.directive('lflPlace', function() {
        return {
            controller: function($scope) {}
        };
    });
})();
(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.AboutCtrl',['$scope',function($scope){
    }]);
})();

(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.BasisscholenCtrl',['$scope', '$filter', 'ddsApp.services.ScholenSrvc', 'basisscholen', function($scope, $filter, ScholenSrvc, basisscholen){
        $scope.basisschooltypes = [
            {'label':'-- Alle basisscholen --','value':''},
            {'label':'Kleuterscholen','value':'Kleuter'},
            {'label':'Lagere scholen','value':'Lager'},
            {'label':'Buitengewoon onderwijs','value':'Buitengewoon'},
            {'label':'Kunstonderwijs','value':'KO'}
        ];

        $scope.form = {
            basisschooltype: $scope.basisschooltypes[0]
        };

        $scope.$watch('form.basisschooltype', function(newValue, oldValue){
            if($scope.basisscholen !== null)
            {
                var filteredBasisscholen = $scope.basisscholen;

                if($scope.form.basisschooltype.value !== '')
                    filteredBasisscholen = $filter('filter')($scope.basisscholen, {'aanbod':$scope.form.basisschooltype.value});

                $('#info-message').html('<span class="badge pull-left">' + filteredBasisscholen.length + '</span>' + ' basisscholen');

                var lflPlaces = [];
                angular.forEach(filteredBasisscholen, function(basisschool, key){
                    lflPlaces.push({
                        lat:basisschool.lat,
                        lng:basisschool.long,
                        dsc:'<strong>' + basisschool.roepnaam + '</strong>'
                    });
                });
                $scope.lflplacesbasisscholen = lflPlaces;
                $scope.lflrefresh = true;
            }
        });

        $scope.basisscholen = basisscholen;
        $('#info-message').html('<span class="badge pull-left">' + $scope.basisscholen.length + '</span>' + ' basisscholen');

        var lflPlaces = [];
        angular.forEach($scope.basisscholen, function(basisschool, key){
            lflPlaces.push({
                lat:basisschool.lat,
                lng:basisschool.long,
                dsc:'<strong>' + basisschool.roepnaam + '</strong>'
            });
        });
        $scope.lflplacesbasisscholen = lflPlaces;
        $scope.lflrefresh = true;

        $scope.isList = true;
        $scope.changeIsList = function(isList){
            $scope.isList = isList;
            $scope.lflrefresh = !isList;
        };

        $scope.isSchoolAFavorite = function(schoolId){
            return ScholenSrvc.isBasisschoolAlreadyFavorite(schoolId.toString());
        };
    }]);
})();

(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.BasisschoolCtrl',['$scope', '$routeParams', 'ddsApp.services.ScholenSrvc', 'basisscholen', function($scope, $routeParams, ScholenSrvc, basisscholen){
        var schoolId = $routeParams.schoolId;
        $scope.basisschool = _.find(basisscholen, {'fid':schoolId});

        $scope.lflplace = {
            lat:$scope.basisschool.lat,
            lng:$scope.basisschool.long,
            dsc:'<strong>' + $scope.basisschool.roepnaam + '</strong>'
        };

        $scope.isSchoolAFavorite = ScholenSrvc.isBasisschoolAlreadyFavorite(schoolId);

        $scope.addSchoolToFavorites = function(){
            if(!ScholenSrvc.isBasisschoolAlreadyFavorite(schoolId)){
                ScholenSrvc.addBasisschoolToFavorites(schoolId);
                $scope.isSchoolAFavorite = true;
            }
        };

        $scope.removeSchoolFromFavorites = function(){
            if(ScholenSrvc.isBasisschoolAlreadyFavorite(schoolId)){
                ScholenSrvc.removeBasisschoolFromFavorites(schoolId);
                $scope.isSchoolAFavorite = false;
            }
        };
    }]);
})();

(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.FavorietenCtrl',['$scope',function($scope){
    }]);
})();

(function(){
    'use strict';
    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.HeaderCtrl',['$scope', '$location', '$rootScope',
        function($scope, $location, $rootScope){
            $rootScope.isRouteActive = function(route) {
                if(route === '/')
                    return route === $location.path();
                else
                    return $location.path().indexOf(route) !== -1;
            };
        }
    ]);
})();
(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.MainCtrl',['$scope',function($scope){
    }]);
})();

(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.SecundairescholenCtrl',['$scope', '$filter', 'ddsApp.services.ScholenSrvc', 'secundairescholen', function($scope, $filter, ScholenSrvc, secundairescholen){
        $scope.gemeenten = [
            {
                label: '-- Alle deelgemeenten --',
                value: ''
            },
            {
                label: 'Gent',
                value: 'GENT'
            },
            {
                label: 'Ledeberg',
                value: 'LEDEBERG'
            },
            {
                label: 'Mariakerke',
                value: 'MARIAKERKE'
            },
            {
                label: 'Oostakker',
                value: 'OOSTAKKER'
            },
            {
                label: 'Sint-Amandsberg',
                value: 'SINT-AMANDSBERG'
            },
            {
                label: 'Sint-Denijs-Westrem',
                value: 'SINT-DENIJS-WESTREM'
            },
            {
                label: 'Zwijnaarde',
                value: 'ZWIJNAARDE'
            }
        ];

        $scope.form = {
            gemeente: $scope.gemeenten[0]
        };

        $scope.$watch('form.gemeente', function(newValue, oldValue){
            if($scope.secundairescholen !== null)
            {
                var filteredSecundairescholen = $scope.secundairescholen;

                if($scope.form.gemeente.value !== '')
                    filteredSecundairescholen = $filter('filter')($scope.secundairescholen, {'gemeente':$scope.form.gemeente.value});

                $('#info-message').html('<span class="badge pull-left">' + filteredSecundairescholen.length + '</span>' + ' secundaire scholen');

                var lflPlaces = [];
                angular.forEach(filteredSecundairescholen, function(secundaireschool, key){
                    lflPlaces.push({
                        lat:secundaireschool.lat,
                        lng:secundaireschool.long,
                        dsc:'<strong>' + secundaireschool.naam + '</strong>'
                    });
                });
                $scope.lflplacessecundairescholen = lflPlaces;
                $scope.lflrefresh = true;
            }
        });

        $scope.secundairescholen = secundairescholen;
        $('#info-message').html('<span class="badge pull-left">' + $scope.secundairescholen.length + '</span>' + ' secundaire scholen');

        var lflPlaces = [];
        angular.forEach($scope.secundairescholen, function(secundaireschool, key){
            lflPlaces.push({
                lat:secundaireschool.lat,
                lng:secundaireschool.long,
                dsc:'<strong>' + secundaireschool.naam + '</strong>'
            });
        });
        $scope.lflplacessecundairescholen = lflPlaces;
        $scope.lflrefresh = true;

        $scope.isList = true;
        $scope.changeIsList = function(isList){
            $scope.isList = isList;
            $scope.lflrefresh = !isList;
        };
    }]);
})();

(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.ToDoCtrl',['$scope',function($scope){
        $scope.items = [
            {'text':'pampers verversen','state':'completed'},
            {'text':'scheren','state':'todo'},
            {'text':'bower','state':'completed'}
        ];

        $scope.addNewItem = function(){
            var newItem = {'text':$scope.itemText, 'state':'todo'};
            $scope.items.push(newItem);

            $scope.itemText = '';
        };

        $scope.completeItem = function(item){
          switch(item.state){
              case 'completed':
                  item.state = 'todo';
                  break;
              case 'todo':
                  item.state = 'completed';
                  break;
              default:
                  item.state = 'todo';
                  break;
          }
        };
    }]);
})();

(function(){
    'use strict';

    var services = angular.module('ddsApp.services');

    services.factory('ddsApp.services.ScholenSrvc',
    ['$rootScope', '$http', '$q', 'localStorageService', function($rootScope, $http, $q, localStorageService){
        var URLBASISSCHOLEN = 'http://data.appsforghent.be/poi/basisscholen.json?callback=JSON_CALLBACK';
        var URLSECUNDAIRESCHOLEN = 'http://data.appsforghent.be/poi/secundairescholen.json?callback=JSON_CALLBACK';
        var MSGBASISSCHOLENLOADERROR = 'Could not load the basischolen data from the requested URI.';
        var MSGSECUNDAIRESCHOLENLOADERROR = 'Could not load the secundaire scholen data from the requested URI.';
        var MSGSCHOLENLOADERROR = 'Could not load the basischolen and/or secundaire scholen data from the requested URI.';

        var _basisscholen = null,
            _secundairescholen = null,
            _favosBasisscholen = null,
            _favosSecundairescholen = null,
            _numberOfResourcesToLoadViaAJAX = 2,
            _numberOfResourcesLoadedViaAJAX = 0;

        var that = this;//Hack for calling private functions and variables in the return statement

        this.loadBasisscholen = function(){
            var deferred = $q.defer();

            if(_basisscholen === null){
                if(localStorageService.get('basisscholen') === null){
                    $http.jsonp(URLBASISSCHOLEN).
                        success(function(data, status, headers, config){
                            _basisscholen = data.basisscholen;
                            localStorageService.set('basisscholen', _basisscholen);
                            deferred.resolve(_basisscholen);
                        }).
                        error(function(data, status, headers, config){
                            deferred.reject(MSGBASISSCHOLENLOADERROR);
                        });
                }else{
                    _basisscholen = localStorageService.get('basisscholen');
                    deferred.resolve(_basisscholen);
                }
            }else{
                deferred.resolve(_basisscholen);
            }

            return deferred.promise;//Always return a promise
        };

        this.loadSecundairescholen = function(){
            var deferred = $q.defer();

            if(_secundairescholen === null){
                if(localStorageService.get('secundairescholen') === null){
                    $http.jsonp(URLSECUNDAIRESCHOLEN).
                        success(function(data, status, headers, config){
                            _secundairescholen = data.secundairescholen;
                            localStorageService.set('secundairescholen', _secundairescholen);
                            deferred.resolve(_secundairescholen);

                        }).
                        error(function(data, status, headers, config){
                            deferred.reject(MSGSECUNDAIRESCHOLENLOADERROR);
                        });
                }
                else{
                    _secundairescholen = localStorageService.get('secundairescholen');
                    deferred.resolve(_secundairescholen);
                }
            }else{
                deferred.resolve(_secundairescholen);
            }

            return deferred.promise;//Always return a promise
        };

        return{
            loadData:function(){
                var deferred = $q.defer();

                that.loadBasisscholen().then(
                    function(data){
                        _numberOfResourcesLoadedViaAJAX++;
                        if(_numberOfResourcesLoadedViaAJAX === _numberOfResourcesToLoadViaAJAX){
                            deferred.resolve(true);
                        }
                    },
                    function(error){
                        deferred.reject(MSGSCHOLENLOADERROR);
                    }
                );

                that.loadSecundairescholen().then(
                    function(data){
                        _numberOfResourcesLoadedViaAJAX++;
                        if(_numberOfResourcesLoadedViaAJAX === _numberOfResourcesToLoadViaAJAX){
                            deferred.resolve(true);
                        }
                    },
                    function(error){
                        deferred.reject(MSGSCHOLENLOADERROR);
                    }
                );

                return deferred.promise;
            },
            getDataBasisscholen:function(){
                var deferred = $q.defer();

                if(_basisscholen === null){
                    deferred.reject(MSGBASISSCHOLENLOADERROR);
                }else{
                    deferred.resolve(_basisscholen);
                }

                return deferred.promise;
            },
            getDataSecundairescholen:function(){
                var deferred = $q.defer();

                if(_secundairescholen === null){
                    deferred.reject(MSGSECUNDAIRESCHOLENLOADERROR);
                }else{
                    deferred.resolve(_secundairescholen);
                }

                return deferred.promise;
            },
            isBasisschoolAlreadyFavorite:function(schoolId){
                if(localStorageService.get('basisscholenfavorites') === null)
                    return false;

                var favos = localStorageService.get('basisscholenfavorites');

                var school = _.find(favos, function(sId){
                   return sId === schoolId;
                });

                if(typeof school === 'undefined')
                    return false;

                return true;
            },
            addBasisschoolToFavorites:function(schoolId){
                if(!this.isBasisschoolAlreadyFavorite(schoolId)){
                    _favosBasisscholen = localStorageService.get('basisscholenfavorites');

                    if(_favosBasisscholen === null){
                        _favosBasisscholen = [];
                    }

                    _favosBasisscholen.push(schoolId);
                    localStorageService.set('basisscholenfavorites', _favosBasisscholen);
                }
            },
            removeBasisschoolFromFavorites:function(schoolId){
                if(this.isBasisschoolAlreadyFavorite(schoolId)){
                    _favosBasisscholen = localStorageService.get('basisscholenfavorites');

                    if(_favosBasisscholen !== null){
                        _favosBasisscholen = _.pull(_favosBasisscholen, schoolId);
                        localStorageService.set('basisscholenfavorites', _favosBasisscholen);
                    }
                }
            }
        };
    }]);
})();
