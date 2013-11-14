(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.ToDoCtrl',['$scope',function($scope){
        $scope.items = [
            {'text':'pampers verversen','state':'completed'},
            {'text':'scheren','state':'todo'},
            {'text':'bower','state':'completed'}
        ];
    }]);
})();
