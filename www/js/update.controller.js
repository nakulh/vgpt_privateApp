var app = angular.module('update.controller', ['update.service']);
app.controller('UpdateCtrl', function($scope, UpdateService){
  $scope.checkUpdates = function(){
    UpdateService.checkUpdates().then(function(data){
      console.log("complete");
      console.log(data);
    });
  };
});
