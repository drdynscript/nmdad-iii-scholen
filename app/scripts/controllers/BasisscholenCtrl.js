(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.BasisscholenCtrl',['$scope', 'ddsApp.services.ScholenSrvc', function($scope, ScholenSrvc){
        ScholenSrvc.loadData();
    }]);
})();
