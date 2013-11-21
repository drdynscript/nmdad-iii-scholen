(function(){
    'use strict';

    var directives = angular.module('ddsApp.directives');

    directives.directive('leafletmanyplaces',function($window){
        return{
            restrict: 'E',
            transclude: true,
            scope:{
                lflPlaces: '='
            },
            require: '^lflPlaces',
            link:function(scope, element, attrs){
                element.addClass('leaflet-holder');
                console.log(element[0]);
                scope.map = new L.Map(element,{
                    scrollWheelZoom: false
                });
                scope.layer = new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(scope.map);
            }
        };
    });

    directives.directive('lflPlaces',function($window){
        return{
            controller:function($scope){}
        };
    });
})();