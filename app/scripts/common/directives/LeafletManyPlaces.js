(function(){
    'use strict';
    var directives = angular.module('ddsApp.directives');

    directives.directive('leafletmanyplaces',
        function($window){
            return {
                restrict: 'E',
                transclude: true,
                require: '^lflPlaces',
                scope:{
                    lflPlaces: '=',
                    lflRefresh: '='
                },
                link: function mapLink (scope, element, attrs) {
                    var schoolIcon = L.icon({
                        iconUrl: 'content/images/school_marker.png',
                        iconRetinaUrl: 'content/images/school_marker.png',
                        iconSize: [32, 37],
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37],
                        shadowUrl: 'content/images/school_marker.png',
                        shadowRetinaUrl: 'content/images/school_marker.png',
                        shadowSize: [32, 37],
                        shadowAnchor: [16, 37]
                    });

                    element.addClass('leaflet-holder');
                    scope.map = new L.Map(element[0], {
                        scrollWheelZoom: false
                    });
                    scope.map.setView([51.053319, 3.730274], 14);
                    scope.layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data © OpenStreetMap contributors'
                    }).addTo(scope.map);

                    scope.$watch('lflPlaces', function(newVal, oldVal) {
                        var val = oldVal;
                        if(newVal){
                            val = newVal;
                        }
                        if(val){
                            scope.map.setView(new L.LatLng(51.053319, 3.730274), 14);
                            if(scope.markers){
                                angular.forEach(scope.markers, function(marker, key){
                                    scope.map.removeLayer(marker);
                                });
                            }

                            scope.markers = [];
                            angular.forEach(val, function(place, key){
                                scope.markers.push(new L.marker(new L.LatLng(place.lat, place.lng),{icon:schoolIcon}).addTo(scope.map)
                                    .bindPopup(place.dsc));
                            });

                            L.Util.requestAnimFrame(scope.map.invalidateSize,scope.map,false,scope.map._container);
                        }
                    });

                    angular.element($window).bind('resize', function () {
                        scope.$apply();
                        L.Util.requestAnimFrame(scope.map.invalidateSize,scope.map,false,scope.map._container)
                    });

                    scope.$watch('lflRefresh', function(oldVal, newVal) {
                        scope.map.invalidateSize(false);
                    });

                    scope.map.invalidateSize(false);

                    scope.$broadcast('mapAvailable', scope.map);
                }
            };
        }
    );

    directives.directive('lflPlaces', function() {
        return {
            controller: function($scope) {}
        };
    });

    directives.directive('lflRefresh', function() {
        return {
            controller: function($scope) {}
        };
    });

})();