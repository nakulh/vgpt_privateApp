var app = angular.module('test.controller', ['db.service', 'test.service']);
app.controller('TestListCtrl', function($scope, DbTest, TestUpdate, $location){
  $scope.submit = function(code){
    DbTest.checkCode(code).then(function(res){
      if(res){
        console.log("correct test code redirecting......");
        var path = "/testlist/" + code;
      //  $location.path(path);
      }
      else{
        $scope.message = "incorrect password!";
      }
    });
  };
  $scope.insertTest = function(){
    TestUpdate.insertTest();
  };
});

app.controller('TestOverviewCtrl', function($scope){

});

app.controller('TestQuestionCtrl', function($scope){

});

app.controller('TestEndCtrl', function($scope){

});
