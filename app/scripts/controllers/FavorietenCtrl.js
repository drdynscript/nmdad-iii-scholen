(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.FavorietenCtrl',['$scope', '$filter', 'ddsApp.services.ScholenSrvc', 'favosbasisscholen', 'favossecundairescholen', function($scope, $filter, ScholenSrvc, favosbasisscholen, favossecundairescholen){

        $scope.favosbasisscholen = favosbasisscholen;
        $scope.favossecundairescholen = favossecundairescholen;

        $scope.removeBasisschoolFromFavorites = function(schoolId){
            schoolId = schoolId.toString();
            if(ScholenSrvc.isBasisschoolAlreadyFavorite(schoolId)){
                ScholenSrvc.removeBasisschoolFromFavorites(schoolId);
                ScholenSrvc.getFavoritesBasisscholen().then(
                    function(data){
                        $scope.favosbasisscholen = data;
                    },
                    function(error){
                        deferred.reject(error);
                    }
                );
            }
        };

        $scope.removeSecundaireschoolFromFavorites = function(schoolId){
            schoolId = schoolId.toString();
            if(ScholenSrvc.isSecundaireschoolAlreadyFavorite(schoolId.toString())){
                ScholenSrvc.removeSecundaireschoolFromFavorites(schoolId);
                ScholenSrvc.getFavoritesSecundairescholen().then(
                    function(data){
                        $scope.favossecundairescholen = data;
                    },
                    function(error){
                        deferred.reject(error);
                    }
                );
            }
        };
    }]);
})();
