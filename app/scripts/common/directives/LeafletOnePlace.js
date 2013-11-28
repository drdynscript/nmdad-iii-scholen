(function(){
    'use strict';
    var directives = angular.module('ddsApp.directives');

    directives.directive('leafletoneplace',
        function(){
            return {
                restrict: 'E',
                transclude: true,
                require: '^lflPlace',
                scope:{
                    lflPlace: '='
                },
                templateUrl: 'partials/leaflet.html',
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
                    new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data Â© OpenStreetMap contributors'
                    }).addTo(scope.map);

                    scope.$watch('lflPlace', function(oldVal, newVal) {
                        var val = oldVal;
                        if(newVal){
                            val = newVal;
                        }
                        if(val){
                            scope.map.setView(new L.LatLng(val.lat, val.lng), val.zoom || 10);
                            scope.marker = new L.marker(new L.LatLng(val.lat, val.lng), {icon:schoolIcon}).addTo(scope.map)
                                .bindPopup(val.dsc)
                                .openPopup();
                        }
                    });

                    scope.$broadcast('mapAvailable', scope.map);
                }
            };
        }
    );

    directives.directive('lflPlace', function() {
        return {
            controller: function($scope) {}
        };
    });
})();