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
    }]);
})();
