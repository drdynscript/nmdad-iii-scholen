(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.BasisscholenCtrl',['$scope', 'ddsApp.services.ScholenSrvc', function($scope, ScholenSrvc){
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

        $scope.basisscholen = null;

        if(ScholenSrvc.getDataBasisscholen() !== null){
            $scope.basisscholen = ScholenSrvc.getDataBasisscholen();
            console.log($scope.basisscholen);
        }
    }]);
})();
