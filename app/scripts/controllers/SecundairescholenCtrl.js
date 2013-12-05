(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.SecundairescholenCtrl',['$scope', '$filter', 'ddsApp.services.ScholenSrvc', 'secundairescholen', function($scope, $filter, ScholenSrvc, secundairescholen){
        $scope.gemeenten = [
            {
                label: '-- Alle deelgemeenten --',
                value: ''
            },
            {
                label: 'Gent',
                value: 'GENT'
            },
            {
                label: 'Ledeberg',
                value: 'LEDEBERG'
            },
            {
                label: 'Mariakerke',
                value: 'MARIAKERKE'
            },
            {
                label: 'Oostakker',
                value: 'OOSTAKKER'
            },
            {
                label: 'Sint-Amandsberg',
                value: 'SINT-AMANDSBERG'
            },
            {
                label: 'Sint-Denijs-Westrem',
                value: 'SINT-DENIJS-WESTREM'
            },
            {
                label: 'Zwijnaarde',
                value: 'ZWIJNAARDE'
            }
        ];

        $scope.form = {
            gemeente: $scope.gemeenten[0]
        };

        $scope.$watch('form.gemeente', function(newValue, oldValue){
            if($scope.secundairescholen !== null)
            {
                var filteredSecundairescholen = $scope.secundairescholen;

                if($scope.form.gemeente.value !== '')
                    filteredSecundairescholen = $filter('filter')($scope.secundairescholen, {'gemeente':$scope.form.gemeente.value});

                $('#info-message').html('<span class="badge pull-left">' + filteredSecundairescholen.length + '</span>' + ' secundaire scholen');

                var lflPlaces = [];
                angular.forEach(filteredSecundairescholen, function(secundaireschool, key){
                    lflPlaces.push({
                        lat:secundaireschool.lat,
                        lng:secundaireschool.long,
                        dsc:'<strong>' + secundaireschool.naam + '</strong>'
                    });
                });
                $scope.lflplacessecundairescholen = lflPlaces;
                $scope.lflrefresh = true;
            }
        });

        $scope.secundairescholen = secundairescholen;
        $('#info-message').html('<span class="badge pull-left">' + $scope.secundairescholen.length + '</span>' + ' secundaire scholen');

        var lflPlaces = [];
        angular.forEach($scope.secundairescholen, function(secundaireschool, key){
            lflPlaces.push({
                lat:secundaireschool.lat,
                lng:secundaireschool.long,
                dsc:'<strong>' + secundaireschool.naam + '</strong>'
            });
        });
        $scope.lflplacessecundairescholen = lflPlaces;
        $scope.lflrefresh = true;

        $scope.isList = true;
        $scope.changeIsList = function(isList){
            $scope.isList = isList;
            $scope.lflrefresh = !isList;
        };

        $scope.isSchoolAFavorite = function(schoolId){
            return ScholenSrvc.isSecundaireschoolAlreadyFavorite(schoolId.toString());
        };
    }]);
})();
