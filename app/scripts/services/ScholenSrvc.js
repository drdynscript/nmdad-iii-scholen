(function(){
    'use strict';

    var services = angular.module('ddsApp.services');

    services.factory('ddsApp.services.ScholenSrvc',
    ['$rootScope', '$http', function($scope, $http){
        var URLBASISSCHOLEN = "http://data.appsforghent.be/poi/basisscholen.json?callback=JSON_CALLBACK";

        var basisscholen = null;

        var that = this;

        this.loadBasisscholen = function(){
            $http.jsonp(URLBASISSCHOLEN).
                success(function(data, status, headers, config){
                    console.log(data);
                }).
                error(function(data, status, headers, config){
                    console.log("ERROR");
                });
        };

        return{
            loadData:function(){
                that.loadBasisscholen();
            }
        }
    }]);
})();
