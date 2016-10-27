var app = angular.module('user.controller', ['db.service']);
app.controller('UserCtrl', function($scope, DbServiceSettings){
  DbServiceSettings.getUserInfo().then(function(res){
    $scope.user = {
      name: res[0] + " " + res[1],
      admnNo: res[2],
      batch: res[4],
      pointsTotal: res[5],
      pointsCurrent: res[6]
    };
  }, function(err){
    console.log("error getting user profile");
  });
  DbServiceSettings.getSubjectPointsInfo().then(function(res){
    $scope.subjectPoints = [];
    for(var x = 0; x < res.length; x++){
      $scope.subjectPoints.push(res.item(x));
    }
  }, function(err){
    console.log("error points subject profile");
  });
});
//192.168.1.107:8080
