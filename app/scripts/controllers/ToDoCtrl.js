(function(){
    'use strict';

    var controllers = angular.module('ddsApp.controllers');

    controllers.controller('ddsApp.controllers.ToDoCtrl',['$scope',function($scope){
        $scope.items = [
            {'text':'pampers verversen','state':'completed'},
            {'text':'scheren','state':'todo'},
            {'text':'bower','state':'completed'}
        ];

        $scope.addNewItem = function(){
            var newItem = {'text':$scope.itemText, 'state':'todo'};
            $scope.items.push(newItem);

            $scope.itemText = '';
        }

        $scope.completeItem = function(item){
          switch(item.state){
              case 'completed':
                  item.state = 'todo';
                  break;
              case 'todo':
                  item.state = 'completed';
                  break;
              default:
                  item.state = 'todo';
                  break;
          }
        };
    }]);
})();
