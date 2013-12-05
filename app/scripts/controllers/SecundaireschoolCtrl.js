(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.SecundaireschoolCtrl',['$scope', '$routeParams', 'ddsApp.services.ScholenSrvc', 'secundairescholen', function($scope, $routeParams, ScholenSrvc, secundairescholen){
        var schoolId = $routeParams.schoolId;
        $scope.secundaireschool = _.find(secundairescholen, {'fid':schoolId});

        $scope.lflplace = {
            lat:$scope.secundaireschool.lat,
            lng:$scope.secundaireschool.long,
            dsc:'<strong>' + $scope.secundaireschool.naam + '</strong>'
        };

        $scope.isSchoolAFavorite = ScholenSrvc.isSecundaireschoolAlreadyFavorite(schoolId);

        $scope.addSchoolToFavorites = function(){
            if(!ScholenSrvc.isSecundaireschoolAlreadyFavorite(schoolId)){
                ScholenSrvc.addSecundaireschoolToFavorites(schoolId);
                $scope.isSchoolAFavorite = true;
            }
        };

        $scope.removeSchoolFromFavorites = function(){
            if(ScholenSrvc.isSecundaireschoolAlreadyFavorite(schoolId)){
                ScholenSrvc.removeSecundaireschoolToFavorites(schoolId);
                $scope.isSchoolAFavorite = false;
            }
        };
    }]);
})();
