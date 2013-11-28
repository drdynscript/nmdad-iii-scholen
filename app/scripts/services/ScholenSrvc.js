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
