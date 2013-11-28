(function(){
    'use strict';

    var services = angular.module('ddsApp.services');

    services.factory('ddsApp.services.ScholenSrvc',
    ['$rootScope', '$http', '$q', function($rootScope, $http, $q){
        var URLBASISSCHOLEN = "http://data.appsforghent.be/poi/basisscholen.json?callback=JSON_CALLBACK";
        var URLSECUNDAIRESCHOLEN = "http://data.appsforghent.be/poi/secundairescholen.json?callback=JSON_CALLBACK";
        var MSGBASISSCHOLENLOADERROR = "Could not load the basischolen data from the requested URI.";
        var MSGSECUNDAIRESCHOLENLOADERROR = "Could not load the secundaire scholen data from the requested URI.";
        var MSGSCHOLENLOADERROR = "Could not load the basischolen and/or secundaire scholen data from the requested URI.";

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
                $http.jsonp(URLBASISSCHOLEN).
                    success(function(data, status, headers, config){
                        _basisscholen = data.basisscholen;
                        deferred.resolve(_basisscholen);
                    }).
                    error(function(data, status, headers, config){
                        deferred.reject(MSGBASISSCHOLENLOADERROR);
                    });
            }else{
                deferred.resolve(_basisscholen);
            }

            return deferred.promise;//Always return a promise
        };

        this.loadSecundairescholen = function(){
            var deferred = $q.defer();

            if(_secundairescholen === null){
                $http.jsonp(URLSECUNDAIRESCHOLEN).
                    success(function(data, status, headers, config){
                        _secundairescholen = data.secundairescholen;
                        deferred.resolve(_secundairescholen);

                    }).
                    error(function(data, status, headers, config){
                        deferred.reject(MSGSECUNDAIRESCHOLENLOADERROR);
                    });
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
            }
        }
    }]);
})();
