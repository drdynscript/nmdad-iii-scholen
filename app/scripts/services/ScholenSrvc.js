(function(){
    'use strict';

    var services = angular.module('ddsApp.services');

    services.factory('ddsApp.services.ScholenSrvc',
    ['$rootScope', '$http', function($rootScope, $http){
        var URLBASISSCHOLEN = "http://data.appsforghent.be/poi/basisscholen.json?callback=JSON_CALLBACK";
        var URLSECUNDAIRESCHOLEN = "http://data.appsforghent.be/poi/secundairescholen.json?callback=JSON_CALLBACK";

        var _basisscholen = null,
            _secundairescholen = null,
            _favosBasisscholen = null,
            _favosSecundairescholen = null,
            _numberOfResourcesToLoadViaAJAX = 2,
            _numberOfResourcesLoadedViaAJAX = 0;

        var that = this;//Hack for calling private functions and variables in the return statement

        this.loadBasisscholen = function(){
            if(_basisscholen === null){
                $http.jsonp(URLBASISSCHOLEN).
                    success(function(data, status, headers, config){
                        _basisscholen = data.basisscholen;
                        $rootScope.$broadcast('ddsApp.services.ScholenSrvc.resourceLoaded');
                    }).
                    error(function(data, status, headers, config){
                        $rootScope.$broadcast('ddsApp.services.ScholenSrvc.resourceError');
                    });
            }else{
                $rootScope.$broadcast('ddsApp.services.ScholenSrvc.resourceLoaded');
            }
        };

        this.loadSecundairescholen = function(){
            if(_secundairescholen === null){
                $http.jsonp(URLSECUNDAIRESCHOLEN).
                    success(function(data, status, headers, config){
                        _secundairescholen = data.secundairescholen;
                        $rootScope.$broadcast('ddsApp.services.ScholenSrvc.resourceLoaded');

                    }).
                    error(function(data, status, headers, config){
                        $rootScope.$broadcast('ddsApp.services.ScholenSrvc.resourceError');
                    });
            }else{
                $rootScope.$broadcast('ddsApp.services.ScholenSrvc.resourceLoaded');
            }
        };

        return{
            loadData:function(){
                $rootScope.$on('ddsApp.services.ScholenSrvc.resourceLoaded', function(){
                    _numberOfResourcesLoadedViaAJAX++;
                    if(_numberOfResourcesLoadedViaAJAX === _numberOfResourcesToLoadViaAJAX)
                        $rootScope.$broadcast('ddsApp.services.ScholenSrvc.resourcesLoaded');
                });
                $rootScope.$on('ddsApp.services.ScholenSrvc.resourceError', function(){
                    $rootScope.$broadcast('ddsApp.services.ScholenSrvc.resourcesError');
                });
                that.loadBasisscholen();
                that.loadSecundairescholen();
            },
            getDataBasisscholen:function(){
                return _basisscholen;
            },
            getDataSecundairescholen:function(){
                return _secundairescholen;
            }
        }
    }]);
})();
