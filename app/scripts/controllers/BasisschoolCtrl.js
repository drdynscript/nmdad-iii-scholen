(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.BasisschoolCtrl',['$scope', '$routeParams', 'ddsApp.services.ScholenSrvc', 'basisscholen', function($scope, $routeParams, ScholenSrvc, basisscholen){
        var schoolId = $routeParams.schoolId;
        $scope.basisschool = _.find(basisscholen, {"fid":schoolId});

        $scope.lflplace = {
            lat:$scope.basisschool.lat,
            lng:$scope.basisschool.long,
            dsc:'<strong>' + $scope.basisschool.roepnaam + '</strong>'
        };
    }]);
})();
