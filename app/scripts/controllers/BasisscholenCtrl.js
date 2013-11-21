(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.BasisscholenCtrl',['$scope', '$filter', 'ddsApp.services.ScholenSrvc', function($scope, $filter, ScholenSrvc){
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
            var filteredBasisscholen = $filter('filter')($scope.basisscholen, {'aanbod':$scope.form.basisschooltype.value});

            $('#info-message').html('<span class="badge pull-left">' + filteredBasisscholen.length + '</span>' + ' basisscholen');
        });

        $scope.basisscholen = null;

        if(ScholenSrvc.getDataBasisscholen() !== null){
            $scope.basisscholen = ScholenSrvc.getDataBasisscholen();
            $('#info-message').html('<span class="badge pull-left">' + $scope.basisscholen.length + '</span>' + ' basisscholen');
        }

        $scope.isList = true;
        $scope.changeIsList = function(isList){
            $scope.isList = isList;
        };
    }]);
})();
